
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification, Message
from apps.utils import send_real_time_notif
from .serializers import NotificationSerializer

@receiver(post_save, sender=Message)
def notify_message(sender, instance, created, **kwargs):
    if created:
        connection = instance.connection
        recipient = connection.get_other_user(instance.sender)
        notif = Notification.objects.create(
            user=recipient,
            notification_type=Notification.NOTIFICATION_TYPES['messages'],
            message=f"You have a new message from {instance.sender.username}: {instance.content[:50]}" + ('...' if len(instance.content) > 50 else ''),
        )
        data = NotificationSerializer(notif)
        send_real_time_notif(recipient.id, data.data)
