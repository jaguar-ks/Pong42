from rest_framework import serializers
from django.contrib.auth import get_user_model

class   SignUpSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

class   AuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        exclude = ('password', )