from django.db import models
from django.utils import timezone

from apps.users.models import User


class Tournament(models.Model):
    name = models.CharField(max_length=150)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_tournaments')
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='won_tournaments', null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    is_finished = models.BooleanField(default=False)
    join_key = models.CharField(max_length=100, unique=True)
    invite_only = models.BooleanField(default=False)


class TournamentParticipant(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournaments')
    seed = models.SmallIntegerField(default=0)
    score = models.SmallIntegerField(default=0)
    eliminated = models.BooleanField(default=False)

    class Meta:
        unique_together = ('tournament', 'user')
    
