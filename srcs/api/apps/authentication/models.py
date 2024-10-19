from django.db import models
from django.contrib.auth import get_user_model
import pyotp

class   SocialAuth(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='social_auth')
    uid = models.CharField(max_length=150)
    provider = models.CharField(max_length=150)

    class   Meta:
        unique_together = ('uid', 'provider', )