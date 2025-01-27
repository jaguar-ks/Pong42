from django.db import models
from django.utils import timezone, timesince
from django.utils import timezone

from apps.users.models import User, DEFAULT_ELO_RATING


class GameMatch(models.Model):
    player1 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="player1_matches"
    )
    player2 = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="player2_matches"
    )
    player1score = models.SmallIntegerField(default=0)
    player2score = models.SmallIntegerField(default=0)
    created_at = models.DateField(default=timezone.now)

    def __str__(self):
        return f"game:{self.pk} - {timesince.timesince(self.created_at)}"


class RatingHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ratings")
    date = models.DateField(default=timezone.now)
    rating = models.FloatField(default=DEFAULT_ELO_RATING)
