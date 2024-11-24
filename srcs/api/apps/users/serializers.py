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


class ConnectionSerializer(serializers.Serializer):
    # Input
    recipient = serializers.IntegerField(write_only=True, required=True)

    # Output
    id = serializers.IntegerField(read_only=True)
    user = UserSerializer(read_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def validate_recipient(self, value):
        user = self.context['request'].user
        try:
            if user.id == value:
                raise serializers.ValidationError("You cannot connect with yourself")

            recipient = User.objects.get(id=value)

            # Check existing connection
            connection_exists = Connection.objects.filter(
                (Q(initiator=user) & Q(recipient=recipient)) |
                (Q(initiator=recipient) & Q(recipient=user))
            ).exists()  # Added .exists() for efficiency

            if connection_exists:
                raise serializers.ValidationError('Connection already exists with this user')

            self.context['recipient'] = recipient
            return value

        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")

    def to_representation(self, instance):
        request = self.context.get('request')
        if not request:
            return {}

        user = instance.get_other_user(request.user)
        user_data = (
            UserSerializer(user).data if instance.status != Connection.BLOCKED
            else {'username': user.username}
        )

        return {
            'id': instance.id,
            'user': user_data,
            'status': instance.status,
            'created_at': instance.created_at,
            'updated_at': instance.updated_at,
        }

    def create(self, validated_data):
        return Connection.objects.create(
            initiator=self.context['request'].user,
            recipient=self.context['recipient'],
        )


class   BlockConnectionSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(write_only=True, required=True)

    def validate(self, attrs):
        user = self.context['request'].user

        if user.id == attrs['user_id'].id:
            raise serializers.ValidationError("You cannot block with yourself")
        
