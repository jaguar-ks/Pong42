from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import os, json, asyncio, redis
from asgiref.sync import sync_to_async
from django.utils.crypto import get_random_string
from apps.users.serializers import UserSerializer
from apps.pongue import pong

r = redis.Redis(host='redis', port=6379, db=0)

class GameConsumer(AsyncWebsocketConsumer):

    REDIS_SESSION_KEY = "game_matchmaking"

    async def destroy_game_session(self):
        await sync_to_async(r.delete)(GameConsumer.REDIS_SESSION_KEY)

    async def get_or_create_game(self):
        game = await sync_to_async(r.hgetall)(GameConsumer.REDIS_SESSION_KEY)
        game = {k.decode(): v.decode() for k, v in game.items()} if game else {}

        if not game:
            room_name = get_random_string(10)
            game = {
                'room_name': room_name,
                'current_player': json.dumps(UserSerializer(self.user).data),
            }
            await sync_to_async(r.hset)(self.REDIS_SESSION_KEY, mapping=game)
            return [game, True]

        await self.destroy_game_session()
        
        # Add new player to the game
        game['players'] = [
            json.loads(game['current_player']),
            UserSerializer(self.user).data
        ]
        del game['current_player']
        return [game, False]


    async def connect(self):
        self.user = self.scope["user"]
        game, created = await self.get_or_create_game()

        self.room_name = game.pop('room_name')
        self.is_waiting = created  # Track if player is waiting for opponent
        await self.channel_layer.group_add(self.room_name, self.channel_name)

        await self.accept()

        if not created:
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": 'game.found',
                    'message': json.dumps(game)
                }
            )
            self.pong_game = pong.Game(game['players'][0]['id'], game['players'][1]['id'])
            self.background_task = asyncio.create_task(self.game_loop())


    async def game_found(self, event):
        data = json.loads(event['message'])
        data['my_id'] = self.user.id
        data['opp_id'] = data['players'][1]['id'] if data['players'][0]['id'] == self.user.id else data['players'][0]['id']
        await self.send(text_data=json.dumps(data))


    async def game_loop(self):
        try:
            while self.pong_game.player1.score < 6 and self.pong_game.player2.score < 6:
                info = self.pong_game.loop()
                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "game_state",
                        "message": json.dumps(info.to_json())
                    }
                )
                await asyncio.sleep(1 / 60)
        except asyncio.CancelledError:
            await self.send(text_data=json.dumps({
                "error": "Game loop cancelled"
            }))


    async def game_state(self, event):
        await self.send(text_data=event['message'])


    async def receive(self, text_data=None, bytes_data=None):
        try:
            data = json.loads(text_data)
            if 'action' not in data.keys() or 'player_id' not in data.keys() or 'direction' not in data.keys():
                raise json.JSONDecodeError
            action = data.get('action')
            player = data.get('player_id')
            dirc = data.get('direction')
            if dirc not in ['left', 'right']:
                raise json.JSONDecodeError
            if action == 'move':
                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "move_paddle",
                        "message": json.dumps({
                            "action": action,
                            "player_id": player,
                            "direction": dirc
                        })
                    }
                )
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "error": "Invalid data format"
            }))


    async def move_paddle(self, event):
        if hasattr(self, 'pong_game'):
            data = json.loads(event['message'])
            print(data, flush=True)
            player_id = data.get('player_id')
            info = self.pong_game.move_paddle(player_id, right=(data.get('direction') == 'right'))
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "game_state",
                    "message": json.dumps(info.to_json())
                }
            )


    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

            # If player was waiting and hadn't found a game, remove their session
            if getattr(self, 'is_waiting', False):
                await self.destroy_game_session()
            else:
                # Announce disconnect to other player if game was in progress
                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "player.disconnected",
                        "message": json.dumps({
                            "event": "player_disconnected",
                            "player": UserSerializer(self.user).data
                        })
                    }
                )
            if hasattr(self, 'background_task'):
                self.background_task.cancel()
        except Exception as e:
            # Log the error appropriately
            print(f"Error in disconnect: {str(e)}")


    async def player_disconnected(self, event):
        """Handle player disconnect notification"""
        await self.send(text_data=event['message'])
