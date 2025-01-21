from rest_framework import serializers

from apps.users.serializers import UserSerializer
from .models import GameMatch


class GameMatchSerializer(serializers.ModelSerializer):

    player1 = UserSerializer()
    player2 = UserSerializer()

    class Meta:
        model = GameMatch
        fields = '__all__'
    
