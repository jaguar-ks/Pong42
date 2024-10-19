from django.db import models
from django.contrib.auth.models import AbstractUser
import pyotp

def generate_secret():
    return pyotp.random_base32()

class   User(AbstractUser):
    otp_secret = models.CharField(max_length=6, default=generate_secret())
    two_fa_enabled = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    avatar_url = models.URLField(max_length=200, null=True, blank=True)
    wins = models.PositiveSmallIntegerField(default=0)
    loses = models.PositiveSmallIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=500)
    
    @property
    def otp_uri(self):
        return pyotp.TOTP(self.otp_secret).provisioning_uri(
            name=str(self.username), issuer_name='transcendance',
        )
    
    def rotate_otp(self) -> str:
        self.otp_secret = pyotp.random_base32()
        self.two_fa_enabled = False
    
    def verify_otp(self, otp_code) -> bool:
        return pyotp.TOTP(self.otp_secret).verify(otp_code)