from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json, asyncio
from asgiref.sync import sync_to_async
from apps.users.models import Connection
from apps.pongue import pong

from apps.pongue.managers import GameRoom, RoomsManager, GameException

from typing import Tuple


class GameConsumer(AsyncJsonWebsocketConsumer):
    manager = RoomsManager

    async def __handle_private_room(self, room_name: str) -> Tuple[GameRoom, bool]:
        """Handle joining/creating private rooms"""
        room = await self.manager.get_room(room_name=room_name)
        if not room:
            room = await self.manager.create_new_room(
                room_name=room_name, participants={self.user.id}, is_invite_only=True
            )
            return room, False
        await room.add_participant(self.user)
        return room, True

    async def __handle_public_matchmaking(self) -> Tuple[GameRoom, bool]:
        """Handle public matchmaking logic"""
        blocked_ids = await sync_to_async(Connection.get_blocked_ids)(self.user)
        for room in self.manager.rooms.values():
            if (
                not room.is_invite_only
                and len(room.participants) < 2
                and not blocked_ids & room.participants
            ):
                await room.add_participant(self.user, safe=True)
                return room, True
        room = await self.manager.create_new_room(participants={self.user.id})
        return room, False

    async def __mark_user(self):
        async with self.manager.participants_lock:
            self.manager.participants[self.user.id] += 1

    async def __unmark_user(self):
        async with self.manager.participants_lock:
            self.manager.participants[self.user.id] -= 1
            if not self.manager.participants[self.user.id]:
                del self.manager.participants[self.user.id]
                
    async def __clear_resources(self):
        await self.__unmark_user()
        if hasattr(self, "room_name"):
            await self.channel_layer.group_discard(self.room_name, self.channel_name)
            await self.manager.destroy_room(self.room_name)

    async def connect(self):
        self.user = self.scope["user"]
        await self.accept()

        room_name = self.scope["url_route"]["kwargs"].get("room_name", None)

        try:
            await self.__mark_user()
            if self.manager.participants[self.user.id] > 1:
                raise GameException("you already have another active game session")

            if room_name:
                room, ready = await self.__handle_private_room(room_name=room_name)
            else:
                room, ready = await self.__handle_public_matchmaking()

            self.room_name = room.name
            print(f'room found: {self.room_name}')
            await self.channel_layer.group_add(self.room_name, self.channel_name)

            if not ready:
                await self.send_json({"type": "room.waiting", "data": room.as_dict()})
                return
            self.start_game(room)

        except GameException as e:
            await self.send_json({"error": str(e)}, close=True)

        except Exception as e:  # DEBUG:
            await self.send_json({"warning": str(e)}, close=True)
            raise e

    def start_game(self, room: GameRoom):
        participants = list(room.participants)
        room.game = pong.Game(
            participants[0],
            participants[1],
        )
        room.game_task = asyncio.create_task(self.game_loop(room))

    async def game_loop(self, room: GameRoom):

        await self.channel_layer.group_send(
            room.name,
            {
                "type": "game.start",
                "message": json.dumps({"type": "game.start", "data": room.as_dict()}),
            },
        )

        await asyncio.sleep(5)

        try:
            while room.game.player1.score < 5 and room.game.player2.score < 5:
                async with room.room_lock:
                    info = room.game.loop()

                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "game.update",
                        "message": json.dumps(
                            {"type": "game.update", "data": info.to_json()}
                        ),
                    },
                )

                await asyncio.sleep(1 / 60)

            winner = (
                room.game.player1
                if room.game.player1.score > room.game.player2.score
                else room.game.player2
            )
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "game.over",
                    "message": json.dumps(
                        {"event": "game.over", "data": {"winner": winner.player_id}}
                    ),
                },
            )
        except asyncio.CancelledError:
            pass

    async def disconnect(self, code):
        await self.__clear_resources()
        if hasattr(self, 'room_name'):
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "opponent.disconnected",
                    "message": json.dumps(
                        {
                            "type": "opponent.disconnected",
                        }
                    ),
                },
            )

    async def receive_json(self, content, **kwargs):
        try:
            action = content.get("action")
            direction = content.get("direction")
            assert action == "move"
            assert direction in ["left", "right"]

            room = await self.manager.get_room(self.room_name)
            
            async with room.room_lock:
                info = room.game.move_paddle(
                    self.user.id, right=(direction == 'right')
                )
            await self.channel_layer.group_send(
                self.room_name,
                await self.channel_layer.group_send(
                    self.room_name,
                    {
                        "type": "game.update",
                        "message": json.dumps(
                            {"type": "game.update", "data": info.to_json()}
                        ),
                    },
                )
            )
        except Exception as e:
            await self.send_json({"error": f"invalid data: {json.dumps(content)}"})

    async def game_start(self, event):

        # TODO: remove 3 lines bellow
        data = json.loads(event['message'])
        data['data']['my_id'] = self.user.id
        data['data']['opp_id'] = data['data']['participants'][0] if self.user.id != data['data']['participants'][0] else data['data']['participants'][1]
        self.opp_id = data['data']['opp_id']
        await self.send_json(data)

    async def game_update(self, event):
        message = json.loads(event["message"])
        message["data"]["me"] = message["data"][str(self.user.id)]
        message["data"]["opp"] = message["data"][str(self.opp_id)]
        await self.send_json(message)

    async def game_over(self, event):
        await self.send(event["message"])
        await self.__clear_resources()
        await self.close()

    async def opponent_disconnected(self, event):
        await self.send(event["message"])
        await self.__clear_resources()
        await self.close()

