from channels.generic.websocket import AsyncWebsocketConsumer
import json
from datetime import datetime, timedelta
import asyncio

TIMEOUT = 30


class   PongueConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.is_routed = False
        self.room_group_name = None
        self.timeout_task = None


    async def connect(self):
        await self.accept()
        self.timeout_task = asyncio.create_task(self.check_timeout())


    async def send_json(self, event=None, error=None, data=None, close=False, code=None) -> None:
        if not event and not error:
            raise ValueError("event and error args cannot be both empty")
        if event and error:
            raise ValueError("event and error args cannot choose between them")

        json_data = {}

        for arg in ('event', 'error', 'data'):
            if (value := locals().get(arg)) is not None:
                json_data[arg] = value

        await super().send(text_data=json.dumps(json_data))
        if close:
            await self.close(code=code)


    async def receive(self, text_data=None, bytes_data=None):
        super().receive()
        if bytes_data is not None:
            await self.send_json(error="invalid data is not allowed", close=True)
        try:
            data = json.dumps(text_data)
            if not isinstance(data, dict) or 'action' not in data:
                await self.send_json(error='invalid data format', close=True)
            await self.receive_json(action=data.pop('action'), json_data=data)
        except:
            await self.send_json(error='invalid data format', close=True)


    async def receive_json(self, action, json_data):
        pass

    async def check_timeout(self):
        await asyncio.sleep(TIMEOUT)

        if not self.is_routed:
            await self.send_json(
                error=f"no message within {TIMEOUT} seconds, disconnecting...",
                close=True,
                code=4002
            )
