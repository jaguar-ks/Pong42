from rest_framework import serializers
from apps.utils import validators
from django.db.models import Q

from .models import Connection, User

class   AuthUserSerializer(serializers.ModelSerializer):
    otp_uri = serializers.SerializerMethodField(method_name='get_otp_uri', read_only=True)
    class   Meta:
        model = User
        exclude = ('password', )

    def get_otp_uri(self, user) -> str:
        if user.two_fa_enabled:
            return ""
        return user.otp_uri

class   UserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = User
        fields = ('id', 'username', 'avatar_url', 'is_online')

class   UserDetailSerializer(UserSerializer):
    class   Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + (
            'first_name', 'last_name', 'wins', 'loses', 'rating', 'rank'
        )


class   UpdateAuthUserSerializer(serializers.ModelSerializer):
    class   Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username', 'avatar_url', 'password')
        extra_kwargs = {
            'username': {
                'required': False,
                'validators': [validators.UsernameValidator()],
            },
            'password': {
                'write_only': True,
                'required': False,
                'validators': [validators.PasswordValidator()]
            },
            'first_name': {'validators': [validators.NameValidator('First name')]},
            'last_name': {'validators': [validators.NameValidator('Last name')]},
            'avatar_url': {'required': False}
        }

    def validate(self, attrs):
        return {key: value for key, value in attrs.items() if value}

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)
