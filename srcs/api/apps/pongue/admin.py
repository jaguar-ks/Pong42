from django.contrib import admin

from .models import (
    Tournament,
    TournamentParticipant,
    MatchParticipant,
    PongMatch,
)


@admin.register(Tournament)
class TournamentModelAdmin(admin.ModelAdmin):
    pass


@admin.register(TournamentParticipant)
class TournamentParticipantModelAdmin(admin.ModelAdmin):
    pass


@admin.register(MatchParticipant)
class MatchParticipantModelAdmin(admin.ModelAdmin):
    pass


@admin.register(PongMatch)
class PongMatchModelAdmin(admin.ModelAdmin):
    pass
