from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.validators import UniqueValidator

from apps.utils import validators

class   TwoFASerializer(serializers.Serializer):
    otp_code = serializers.CharField(max_length=6, min_length=6, required=True, write_only=True)

    def validate(self, attrs):
        self.user = self.context['request'].user
        if self.user.verify_otp(attrs['otp_code']):
            raise serializers.ValidationError({'otp_code':'Invalid OTP code!'})

        match self.context['action']:
            case 'enable':
                self.user.two_fa_enabled = True
            case 'disable':
                self.user.two_fa_enabled = False
        self.user.save()
        return {'detail': f"successfully {self.context['action']}d two factor authentication"}


class   Token2FaObtainPairSerializer(TokenObtainPairSerializer):
    otp_code = serializers.CharField(max_length=6, min_length=6, required=False, write_only=True)
    
    def validate(self, attrs):
        data = TokenObtainPairSerializer.validate(self, attrs)
        if self.user.two_fa_enabled:
            if 'otp_code' not in attrs:
                raise serializers.ValidationError({'otp_code': 'this field is required'})
            if not self.user.verify_otp(attrs['otp_code']):
                raise serializers.ValidationError({'otp_code':'Invalid OTP code!'})
        return data

class   SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[validators.EmailValidator()])
    class   Meta:
        model = get_user_model()
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'username': {
                'validators': [
                    UniqueValidator(queryset=get_user_model().objects.all()),
                    validators.UsernameValidator()
                ],
            },
            'password': {
                'write_only': True,
                'validators': [validators.PasswordValidator()]
            },
            'first_name': {'validators': [validators.NameValidator('First name')]},
            'last_name': {'validators': [validators.NameValidator('Last name')]}
        }

    def validate(self, data):
        print(data)
        if 'email' not in data:
            raise serializers.ValidationError({'email': 'this field is required'})
        if data.get('first_name') and data.get('last_name'):
            if data['first_name'].lower() == data['last_name'].lower():
                raise serializers.ValidationError("First name and last name should not be the same.")
        return data
    
    def create(self, validated_data):
        user = get_user_model()(**validated_data)
        user.full_clean()
        user.set_password(validated_data['password'])
        user.save()
        return user

