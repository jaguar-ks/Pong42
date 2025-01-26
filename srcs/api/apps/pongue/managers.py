from typing import Dict, Set, List
import asyncio, json
from apps.pongue import pong
from django.utils.crypto import get_random_string
from apps.users.models import Connection
from asgiref.sync import sync_to_async
from collections import defaultdict
from dataclasses import dataclass, asdict

class GameException(Exception):
    pass


@dataclass
class Participant:
    id: int
    username: int
    avatar_url: int
    rating: int

    @classmethod
    def from_user(cls, user):
        return cls(
            id=user.id,
            username=user.username,
            avatar_url=user.avatar_url,
            rating=user.rating
        )


class GameRoom:
    def __init__(self, name: str, participants: Dict[int, Participant], is_invite_only: bool = False):
        self.name = name
        self.participants = participants
        self.is_invite_only = is_invite_only
        self.game_task: asyncio.Task = None
        self.room_lock: asyncio.Lock = asyncio.Lock()
        self.game: pong.Game = None

    def as_dict(self):
        return {
            "room_name": self.name,
            "participants": [asdict(p) for _, p in self.participants.items()],
            "is_invite_only": self.is_invite_only,
            "status": "ready" if len(self.participants) == 2 else "waiting",
        }

    async def add_participant(self, user, safe=False):
        async with self.room_lock:
            if not safe:
                if len(self.participants) >= 2:
                    raise GameException("this room already have 2 players")
                blocked_ids = await sync_to_async(Connection.get_blocked_ids)(user)
                if self.participants.keys() & blocked_ids:
                    raise GameException("this room contains a blocked user")
            self.participants[user.id] = Participant.from_user(user)


class RoomsManager:
    rooms: Dict[str, GameRoom] = {}
    participants: Dict[int, int] = defaultdict(int)
    participants_lock = asyncio.Lock()
    rooms_lock = asyncio.Lock()

    @classmethod
    async def get_room(cls, room_name):
        async with cls.rooms_lock:
            return cls.rooms.get(room_name, None)

    @classmethod
    async def create_new_room(
        cls, participants, is_invite_only=False, room_name=None
    ) -> GameRoom:
        async with cls.rooms_lock:
            room_name = room_name or get_random_string(15)
            while room_name in cls.rooms:
                room_name = get_random_string(15)
            cls.rooms[room_name] = GameRoom(
                name=room_name, participants=participants, is_invite_only=is_invite_only
            )
            return cls.rooms[room_name]

    @classmethod
    async def destroy_room(cls, room_name):
        room = await cls.get_room(room_name)

        if not room:
            return

        if room.game_task:
            async with room.room_lock:
                room.game_task.cancel()
                try:
                    await room.game_task
                except asyncio.CancelledError:
                    pass

        async with cls.rooms_lock:
            del cls.rooms[room_name]
