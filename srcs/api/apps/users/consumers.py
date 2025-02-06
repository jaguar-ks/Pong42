import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, Connection
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()

online_users = []

online_group = 'online_users'

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        global online_group, online_users
        self.user = self.scope["user"]
        self.group_name = f"user_{self.user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )
        await self.channel_layer.group_add(
            online_group,
            self.channel_name,
        )
        await self.accept()
        online_users.append(self.user.id)
        await self.change_online_status(self.user.id, True)
        await self.notify_oline_users()

    async def notify_oline_users(self):
       await self.channel_layer.group_send(
            online_group,
            {
                'type': 'status_update',
                'data': json.dumps({
                    'type': 'online',
                    'user_id': self.user.id,
                    'is_online': self.user.id in online_users,
                })
            }
        )

    async def status_update(self, event):
        await self.send(text_data=event['data'])

    async def disconnect(self, close_code):
        online_users.remove(self.user.id)
        if self.user.id not in online_users:
            await self.change_online_status(self.user.id, False)
            await self.notify_oline_users()
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
            await self.channel_layer.group_discard(
                online_group,
                self.channel_name
            )

    # send a notification
    async def send_notification(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data.get('type') == 'message':
                message = data.get('message')
                recipient_id = data.get('recipient_id')
                
                saved_message = await self.save_message(self.user.id, recipient_id, message)
                if not saved_message:
                    await self.send(text_data=json.dumps({
                        'error': 'Failed to save message'
                    }))
                    return
                
                recipient_channel = f"user_{recipient_id}"
                await self.channel_layer.group_send(
                    recipient_channel,
                    {
                        'type': 'chat_message',
                        'message': message,
                        'sender_id': self.user.id,
                        'sender_username': self.user.username,
                        'timestamp': saved_message.timestamp.isoformat(),
                    }
                )
                await self.send(text_data=json.dumps({
                    'type': 'message',
                    'message': message,
                    'sender_id': self.user.id,
                    'sender_username': self.user.username,
                    'recipient_id': recipient_id,
                    'timestamp': saved_message.timestamp.isoformat(),
                }))
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'error': 'Invalid message format'
            }))
        
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message': event['message'],
            'sender_id': event['sender_id'],
            'sender_username': event['sender_username'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def save_message(self, sender_id, recipient_id, message):
        try:
            sender = User.objects.get(id=sender_id)
            recipient = User.objects.get(id=recipient_id)
            connection = Connection.objects.get(
                (Q(initiator=sender) & Q(recipient=recipient)) |
                (Q(initiator=recipient) & Q(recipient=sender)),
                status=Connection.FRIENDS 
            )
            return Message.objects.create(
                connection=connection,
                sender=sender,
                content=message
            )
        except (User.DoesNotExist, Connection.DoesNotExist):
            return None

    @database_sync_to_async
    def change_online_status(self, user_id, status):
        user = User.objects.get(id=user_id)
        user.is_online = status
        user.save()
