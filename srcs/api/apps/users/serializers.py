from rest_framework import serializers
from apps.utils import validators
from django.db.models import Q
from .models import Connection, User, Message, Notification
from ..utils import send_real_time_notif


class AuthUserSerializer(serializers.ModelSerializer):
    otp_uri = serializers.SerializerMethodField(
        method_name="get_otp_uri", read_only=True
    )

    class Meta:
        model = User
        exclude = ("password",)

    def get_otp_uri(self, user) -> str:
        if user.two_fa_enabled:
            return ""
        return user.otp_uri


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "avatar_url",
            "is_online",
            "wins",
            "loses",
            "rating",
            "two_fa_enabled",
        )


class ConnectionSerializer(serializers.Serializer):
    # Input
    recipient_id = serializers.IntegerField(write_only=True, required=True)

    # Output
    id = serializers.IntegerField(read_only=True)
    user = UserSerializer(read_only=True)
    status = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def validate_recipient_id(self, value):
        user = self.context["request"].user
        try:
            if user.id == value:
                raise serializers.ValidationError("You cannot connect with yourself")

            recipient = User.objects.get(id=value)

            # Check existing connection
            connection_exists = Connection.objects.filter(
                (Q(initiator=user) & Q(recipient=recipient))
                | (Q(initiator=recipient) & Q(recipient=user))
            ).exists()  # Added .exists() for efficiency

            if connection_exists:
                raise serializers.ValidationError(
                    "Connection already exists with this user"
                )

            self.context["recipient"] = recipient
            return value

        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")

    def to_representation(self, instance):
        request = self.context.get("request")
        if not request:
            return {}

        user = instance.get_other_user(request.user)
        user_data = (
            UserSerializer(user).data
            if instance.status != Connection.BLOCKED
            else {"username": user.username}
        )

        status = instance.status
        if instance.status == Connection.PENDING:
            status = (
                "sent_request"
                if user.id == instance.recipient.id
                else "incoming_request"
            )

        return {
            "id": instance.id,
            "user": user_data,
            "status": status,
            "created_at": instance.created_at,
            "updated_at": instance.updated_at,
        }

    def create(self, validated_data):
        connection = Connection.objects.create(
            initiator=self.context["request"].user,
            recipient=self.context["recipient"],
        )
        
        if connection:
            notif = Notification.objects.create(
                user=connection.recipient,
                notification_type=Notification.NOTIFICATION_TYPES['connections'],
                message=f"{connection.initiator.username} sent you a friend request",
            )
            data = NotificationSerializer(notif)
            send_real_time_notif(notif.user.id, data.data)
        return connection
        


class UserDetailSerializer(UserSerializer):
    connection = serializers.SerializerMethodField(read_only=True)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + (
            "first_name",
            "last_name",
            "connection",
        )

    def get_connection(self, instance):
        user = self.context["request"].user
        conn = (
            Connection.get_user_connections(user=instance).filter(
                Q(initiator=user) | Q(recipient=user)
            )
        ).first()
        if not conn:
            return None
        return ConnectionSerializer(conn, context=self.context).data


class UpdateAuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "username", "avatar_url", "password")
        extra_kwargs = {
            "username": {
                "required": False,
                "validators": [validators.UsernameValidator()],
            },
            "password": {
                "write_only": True,
                "required": False,
                "validators": [validators.PasswordValidator()],
            },
            "first_name": {"validators": [validators.NameValidator("First name")]},
            "last_name": {"validators": [validators.NameValidator("Last name")]},
            "avatar_url": {"required": False},
        }

    def validate(self, attrs):
        return {key: value for key, value in attrs.items() if value}

    def update(self, instance, validated_data):
        if "password" in validated_data:
            instance.set_password(validated_data.pop("password"))
        return super().update(instance, validated_data)

class MessageSerializer(serializers.ModelSerializer):
    sender_id = serializers.CharField(source='sender.id', read_only=True)
    recipient_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Message
        fields = ['id', 'content', 'timestamp', 'is_read', 'sender_id', 'recipient_id']
        read_only_fields = ['id', 'timestamp', 'is_read', 'sender_id']

class NotificationSerializer(serializers.ModelSerializer):
    
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Ensures user is validated
    
    class Meta:
        model = Notification
        fields = [
            'id',             # Include the primary key for API usage
            'user',           # The user associated with the notification
            'notification_type',  # Type of notification
            'message',        # Notification message
            'created_at',     # Timestamp for when the notification was created
            'read',           # Boolean indicating if the notification is read
        ]
        read_only_fields = ['id', 'created_at']  # Mark id and created_at as read-only
