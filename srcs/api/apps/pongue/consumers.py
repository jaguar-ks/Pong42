from channels.generic.websocket import AsyncWebsocketConsumer


class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        if not self.scope["user"].is_authenticated:
            self.close()
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def recieve(self, text_data):
        pass
