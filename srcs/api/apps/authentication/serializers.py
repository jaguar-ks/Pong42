from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainSlidingSerializer
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import AuthenticationFailed

from apps.utils import validators
from .tasks import send_verification_email, send_sign_in_email
from apps.users.serializers import UserSerializer
from apps.users.models import User
from apps.utils import validate_token_and_uid


class TwoFASerializer(serializers.Serializer):
    otp_code = serializers.CharField(
        max_length=6, min_length=6, required=True, write_only=True
    )

    def validate(self, attrs):
        self.user = self.context["request"].user
        if not self.user.verify_otp(attrs["otp_code"]):
            raise serializers.ValidationError({"otp_code": "Invalid OTP code!"})

        match self.context["action"]:
            case "enable":
                self.user.two_fa_enabled = True
            case "disable":
                self.user.two_fa_enabled = False
        self.user.save()
        return {
            "message": f"successfully {self.context['action']}d two factor authentication"
        }


class ObtainSlidingTokenSerializer(TokenObtainSlidingSerializer):
    otp_code = serializers.CharField(
        max_length=6, min_length=6, required=False, write_only=True
    )

    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_email_verified:
            raise AuthenticationFailed("email address is not verified")
        if self.user.two_fa_enabled:
            if "otp_code" not in attrs:
                raise serializers.ValidationError(
                    {"otp_code": "this field is required"}
                )
            if not self.user.verify_otp(attrs["otp_code"]):
                raise serializers.ValidationError({"otp_code": "Invalid OTP code!"})
        data["user"] = UserSerializer(self.user).data
        return data


class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True, validators=[validators.EmailValidator()]
    )

    class Meta:
        model = User
        fields = ("id", "username", "password", "email", "first_name", "last_name")
        extra_kwargs = {
            "username": {
                "validators": [
                    UniqueValidator(queryset=User.objects.all()),
                    validators.UsernameValidator(),
                ],
            },
            "password": {
                "write_only": True,
                "validators": [validators.PasswordValidator()],
            },
            "first_name": {"validators": [validators.NameValidator("First name")]},
            "last_name": {"validators": [validators.NameValidator("Last name")]},
        }

    def validate(self, data):
        if "email" not in data:
            raise serializers.ValidationError({"email": "this field is required"})
        if data.get("first_name") and data.get("last_name"):
            if data["first_name"].lower() == data["last_name"].lower():
                raise serializers.ValidationError(
                    "First name and last name should not be the same."
                )
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.pop("username"),
            email=validated_data.pop("email"),
            password=validated_data.pop("password"),
            **validated_data,
        )
        send_verification_email(user=user)
        return user

    def to_representation(self, instance):
        return {
            "message": "account created successfully, check your email for confirmation",
            **super().to_representation(instance),
        }


class   ResendVerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=150, required=True, write_only=True)
    message = serializers.CharField(max_length=100, read_only=True)

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs["email"])
            if not send_verification_email(user):
                raise serializers.ValidationError("Failed to send verification")
        except User.DoesNotExist:
            raise serializers.ValidationError("this email does not exist")
        return {}

    def create(self, validated_data):
        return {
            "message": "email sent successfully check you inbox"
        }


class   EmailVerifySerializer(serializers.Serializer):
    uid = serializers.CharField(max_length=50, write_only=True)
    token = serializers.CharField(max_length=150, write_only=True)
    message = serializers.CharField(max_length=100, read_only=True)

    def validate(self, attrs):
        user = validate_token_and_uid(
            uid=attrs['uid'],
            token=attrs['token']
        )
        if not user:
            raise serializers.ValidationError(
                f"Link is invalid or expired"
            )
        return {
            'message': "email verified successfully",
        }
