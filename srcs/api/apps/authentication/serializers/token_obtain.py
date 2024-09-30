from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .two_factor import TwoFASerializer

class   Token2FaObtainPairSerializer(TwoFASerializer, TokenObtainPairSerializer):
    def __init__(self, instance=None, data=..., **kwargs):
        super().__init__(instance, data, **kwargs)
        self.context['action'] = 'verify'
    
    def validate(self, attrs):
        data = TokenObtainPairSerializer.validate(self, attrs)
        if self.user.otp.enabled:
            TwoFASerializer.validate(self, attrs)
        return data
