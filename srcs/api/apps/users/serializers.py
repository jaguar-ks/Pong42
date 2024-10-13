from rest_framework import serializers
from django.contrib.auth import get_user_model

class   SignUpSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password', 'first_name', 'last_name', 'avatar_url')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'username': {'min_length': 5, 'max_length': 30},
            'first_name': {'min_length': 2, 'max_length': 30},
            'last_name': {'min_length': 2, 'max_length': 30},
        }
    
    def update(self, instance, validated_data):
        validated_data.pop('email', None)
        return super().update(instance=instance, validated_data=validated_data)

class   AuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        exclude = ('password', )

class   UpdateAuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()