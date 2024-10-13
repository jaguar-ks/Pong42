from rest_framework import serializers
from django.contrib.auth import get_user_model

from apps.authentication.models import OneTimePass

class   TwoFASerializer(serializers.Serializer):
    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = self.context['request'].user

    otp_code = serializers.CharField(max_length=6, min_length=6, required=False)

    def validate(self, attrs):
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