from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .two_factor import TwoFASerializer
from rest_framework import serializers

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
