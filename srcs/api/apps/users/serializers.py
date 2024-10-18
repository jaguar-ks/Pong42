from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.utils import validators

class   AuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        exclude = ('password', )

class   UpdateAuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        fields = ('id', 'first_name', 'last_name', \
                    'username', 'email', 'avatar_url', 'password')
        extra_kwargs = {
            'username': {'validators': [validators.UsernameValidator()]},
            'password': {
                'write_only': True,
                'validators': [validators.PasswordValidator()]
            },
            'email': {'validators': [validators.EmailValidator()]},
            'first_name': {'validators': [validators.NameValidator('First name')]},
            'last_name': {'validators': [validators.NameValidator('Last name')]},
        }
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)