from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import get_random_string

from apps.users.models import User


def make_join_key():
    return get_random_string(10)


class Tournament(models.Model):

    class STATUS(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In Progress"
        FINISHED = "finished", "Finished"

    name = models.CharField(max_length=150)
    creator = models.ForeignKey(
        User, on_delete=models.SET_NULL, related_name="organized_tournaments", null=True
    )
    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="won_tournaments",
        null=True,
        blank=True,
    )
    status = models.CharField(
        max_length=12, default=STATUS.PENDING, choices=STATUS.choices
    )
    join_key = models.CharField(max_length=10, default=make_join_key)
    invite_only = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class TournamentParticipant(models.Model):
    tournament = models.ForeignKey(
        Tournament, on_delete=models.CASCADE, related_name="participants"
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tournaments")
    seed = models.SmallIntegerField(default=0)
    score = models.SmallIntegerField(default=0)
    eliminated = models.BooleanField(default=False)
    alias_name = models.CharField(max_length=100)

    class Meta:
        unique_together = (("tournament", "user"), ("tournament", "alias_name"))

    def __str__(self):
        return str(self.alias_name)


class PongMatch(models.Model):
    tournament = models.ForeignKey(
        Tournament,
        on_delete=models.CASCADE,
        related_name="matches",
        null=True,
        blank=True,
    )
    round = models.CharField(max_length=20, null=True, blank=True)
    winner = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="won_matches",
        null=True,
        blank=True,
    )
    played_at = models.DateTimeField(default=timezone.now)

    class Meta:
        indexes = [models.Index(fields=["tournament", "round"])]
        ordering = ["-played_at"]

    @property
    def is_tournament_match(self):
        return self.tournament is not None

    def __str__(self):
        participants = [str(p.user) for p in self.participants.all()]
        return f"{participants[0]} vs {participants[1]}"


class MatchParticipant(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="match_participations"
    )
    match = models.ForeignKey(
        PongMatch, on_delete=models.CASCADE, related_name="participants"
    )
    score = models.SmallIntegerField(default=0)

    class Meta:
        unique_together = ("match", "user")

    def __str__(self):
        return f"{self.user}: {self.score}"
