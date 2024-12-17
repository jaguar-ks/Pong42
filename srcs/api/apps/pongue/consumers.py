from channels.generic.websocket import AsyncWebsocketConsumer


class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close(code=4004)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def recieve(self, text_data):
        pass
