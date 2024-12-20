import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.forms.models import model_to_dict

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'user_{self.user_id}'

        # Add user to their group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Remove user from the group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def send_notification(self, event):
        # Send notification to WebSocket
        await self.send(text_data=json.dumps(model_to_dict(event['data'])))