from django.db import models
from django.contrib.auth import get_user_model
import pyotp


# one time password for 2 factor authentication 
class   OneTimePass(models.Model):
    user = models.OneToOneField(to=get_user_model(), on_delete=models.CASCADE, related_name='otp')
    otp_secret = models.CharField(max_length=32, blank=True)
    enabled = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.otp_secret:
            self.otp_secret = pyotp.random_base32()
    
    @property
    def otp_uri(self):
        return pyotp.TOTP(self.otp_secret).provisioning_uri(
            name=str(self.user), issuer_name='transcendance',
        )
    
    def verify(self, otp_code) -> bool:
        return pyotp.TOTP(self.otp_secret).verify(otp_code)
    
    def enable(self, otp_code) -> bool:
        if not self.verify(otp_code):
            return False
        self.enable = True
        self.save()
        return True
    
    def disable(self, otp_code):
        if not self.verify(otp_code):
            return False
        self.enable = False
        self.save()
        return True
