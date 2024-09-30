from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from .models import OneTimePass

# create otp for when ever a new user created
@receiver(post_save, sender=get_user_model())
def create_user_onetimepass(sender, instance, created, **kwargs):
    if created:
        OneTimePass.objects.create(user=instance)

# save otp for when ever a new user instance is saved
@receiver(post_save, sender=get_user_model())
def save_user_onetimepass(sender, instance, created, **kwargs):
    instance.otp.save()

