from channels.generic.websocket import AsyncWebsocketConsumer


class   PongueConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()

    async def close(self, code=None, reason=None):
        pass 

    async def receive(self, text_data=None, bytes_data=None):
        pass
    
    async def send(self, text_data=None, bytes_data=None, close=False):
        pass
