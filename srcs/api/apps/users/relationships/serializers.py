from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Relationship

class   UserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        fields = ('id', 'username', 'avatar_url')


class RelationshipSerializer(serializers.ModelSerializer):
    user1 = UserSerializer()
    user2 = UserSerializer()

    class Meta:
        model = Relationship
        fields = '__all__'

