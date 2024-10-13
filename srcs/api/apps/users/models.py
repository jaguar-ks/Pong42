from django.db import models
from django.contrib.auth.models import AbstractUser

class   User(AbstractUser):
    avatar_url = models.URLField(max_length=200, null=True, blank=True)
    wins = models.PositiveSmallIntegerField(default=0)
    loses = models.PositiveSmallIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=500)