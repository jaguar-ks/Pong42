from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.authentication.models import OneTimePass

class   TwoFASerializer(serializers.Serializer):
    otp_code = serializers.CharField(max_length=6, min_length=6, required=False)

    def validate(self, attrs):
        self.user = self.context['request'].user
        if 'otp_code' not in attrs:
            raise serializers.ValidationError({'otp_code': 'this field is required'})
        if not self.user.otp.verify(attrs['otp_code']):
            raise serializers.ValidationError({'otp_code':'Invalid OTP code!'})

        action = self.context['action']
        assert action in ['enable', 'disable']
        
        call = getattr(self.user.otp, action)
        if call(attrs['otp_code']) and action:
            raise serializers.ValidationError(f'Failed to {action} 2FA: Invalid OTP code')
        return {'message': f'Successfully {action}d 2FA'}


class   Token2FaObtainPairSerializer(TokenObtainPairSerializer):
    otp_code = serializers.CharField(max_length=6, min_length=6, required=False)
    
    def validate(self, attrs):
        data = TokenObtainPairSerializer.validate(self, attrs)
        if self.user.otp.enabled:
            if 'otp_code' not in attrs:
                raise serializers.ValidationError({'otp_code', 'this field is required'})
            if not self.user.otp.verify(attrs['otp_code']):
                raise serializers.ValidationError({'otp_code':'Invalid OTP code!'})
        return data

from apps.utils import validators

class   SignUpSerializer(serializers.ModelSerializer):
    class   Meta:
        model = get_user_model()
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'username': {'validators': [validators.UsernameValidator()]},
            'password': {'validators': [validators.PasswordValidator()]},
            'email': {'validators': [validators.EmailValidator()]},
            'first_name': {'validators': [validators.NameValidator('First name')]},
            'last_name': {'validators': [validators.NameValidator('Last name')]}
        }

    def validate(self, data):
        if data.get('first_name') and data.get('last_name'):
            if data['first_name'].lower() == data['last_name'].lower():
                raise serializers.ValidationError("First name and last name should not be the same.")
        return data
