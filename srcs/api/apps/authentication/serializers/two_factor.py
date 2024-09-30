from rest_framework import serializers
from django.contrib.auth import get_user_model

from apps.authentication.models import OneTimePass

class   TwoFASerializer(serializers.Serializer):
    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)
        self.user = self.context['request'].user

    otp_code = serializers.CharField(max_length=6, min_length=6, required=True)
    
    def validate_otp_code(self, otp_code):
        if not self.user.otp.verify(otp_code):
            raise serializers.ValidationError('Invalid OTP code!')
        return otp_code
    
    def validate(self, attrs):
        action = self.context['action']
        assert action in ['enable', 'disable']
        
        call = getattr(self, action)
        if call(self.user.otp, attrs['otp_code']):
            raise serializers.ValidationError(f'Failed to {action} 2FA: Invalid OTP code')
        return {'message': f'Successfully {action}d 2FA'}