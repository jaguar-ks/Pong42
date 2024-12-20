from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from .utils import send_real_time_notification
from ..users.models import Connection

@receiver(post_save, sender=Connection)
def notify_connection(sender, instance, created, **kwargs):
    if created:
        notif = Notification.objects.create(
            user = instance.recipient,
            notification_type = Notification.NOTIFICATION_TYPES[1][0],
            message = f"{instance.initiator.username} sent you a friend request"
        )
        send_real_time_notification(instance.recipient.id, notif)
