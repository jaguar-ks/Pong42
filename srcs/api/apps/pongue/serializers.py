from rest_framework import serializers

from .models import Tournament, TournamentParticipant, MatchParticipant, PongMatch
from apps.users.models import User
from apps.users.serializers import UserSerializer


class MatchParticipantSerializer(serializers.ModelSerializer):

    user = UserSerializer(read_only=True)

    class Meta:
        model = MatchParticipant
        fields = (
            "user",
            "score",
        )


class MatchSerializer(serializers.ModelSerializer):
    participants = MatchParticipantSerializer(many=True)
    is_tournament_match = serializers.SerializerMethodField(
        method_name="is_tournament_match"
    )

    class Meta:
        model = PongMatch
        fields = (
            "id",
            "winner_id",
            "played_at",
            "participants",
            "is_tournament_match",
            "tournament_id",
            "round",
        )

    def is_tournament_match(self, instance):
        return instance.is_tournament_match


class TournamentSerializer(serializers.ModelSerializer):
    creator = UserSerializer()
    winner = UserSerializer()

    class Meta:
        model = Tournament
        fields = (
            "id",
            "name",
            "creator",
            "winner",
            "status",
            "invite_only",
            "created_at",
            "ended_at",
        )


class TournamentParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TournamentParticipant
        fields = ("id", "user", "seed", "score", "eliminated", "alias_name")


class TournamentMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = PongMatch
        fields = (
            "id",
            "winner_id",
            "played_at",
            "participants",
            "tournament_id",
            "round",
        )


class TournamentDetailSerializer(TournamentSerializer):
    participants = TournamentParticipantSerializer(many=True)
    matches = TournamentMatchSerializer(many=True)

    class Meta(TournamentSerializer.Meta):
        fields = TournamentSerializer.Meta.fields + ("matches", "participants")
