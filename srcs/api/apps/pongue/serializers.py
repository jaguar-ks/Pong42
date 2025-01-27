from rest_framework import serializers

from apps.users.serializers import UserSerializer
from .models import GameMatch, RatingHistory


class GameMatchSerializer(serializers.ModelSerializer):

    player1 = UserSerializer()
    player2 = UserSerializer()

    class Meta:
        model = GameMatch
        fields = "__all__"


class RatingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RatingHistory
        fields = ["date", "rating"]
