from rest_framework import serializers
from django.contrib.auth import get_user_model

class   AuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        exclude = ('password', )

class   UpdateAuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()