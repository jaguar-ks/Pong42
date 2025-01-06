from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
import os, json, asyncio, redis
from asgiref.sync import sync_to_async
from django.utils.crypto import get_random_string
from apps.users.serializers import UserSerializer

r = redis.Redis()

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
    
    async def game_found(self, event):
        self.is_waiting = False  # No longer waiting once game is found
        await self.send(
            text_data=event['message'],
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
        except Exception as e:
            # Log the error appropriately
            print(f"Error in disconnect: {str(e)}")

    async def player_disconnected(self, event):
        """Handle player disconnect notification"""
        await self.send(text_data=event['message'])