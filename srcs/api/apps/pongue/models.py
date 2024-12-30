from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import get_random_string

from apps.users.models import User


def make_join_key():
    return get_random_string(10)


class Tournament(models.Model):
    name = models.CharField(max_length=150)
    creator = models.ForeignKey(
        User, on_delete=models.SET_NULL, 
        related_name="organized_tournaments",
        null=True
    )
    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="won_tournaments",
        null=True,
        blank=True,
    )
    is_finished = models.BooleanField(default=False)
    join_key = models.CharField(max_length=10, default=make_join_key)
    invite_only = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]


class TournamentParticipant(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tournaments')
    seed = models.SmallIntegerField(default=0)
    score = models.SmallIntegerField(default=0)
    eliminated = models.BooleanField(default=False)

    class Meta:
        unique_together = ('tournament', 'user')


class PongueMatch(models.Model):
    players = models.ManyToManyField(User, related_name='matches')
    tournament = models.ForeignKey(
        Tournament, on_delete=models.SET_NULL, related_name='matches', null=True, blank=True
    )
    round = models.CharField(max_length=20, null=True, blank=True)
    winner = models.ForeignKey(User, on_delete=models.SET_NULL, related_name='won_matches', null=True, blank=True)
    played_at = models.DateTimeField(default=timezone.now)

    def is_tournament_match(self):
        return self.tournament is not None
