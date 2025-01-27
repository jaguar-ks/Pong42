
from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.users.models import User
from apps.pongue.models import RatingHistory


@receiver(post_save, sender=User)
def create_first_rating_history(sender, instance, created, **kwargs):
    if created:
        RatingHistory.objects.create(user=instance)
