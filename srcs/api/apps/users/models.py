from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import pyotp


class   UserManager(BaseUserManager):
    def create_user(self, username: str, **kwargs):
        kwargs['is_active'] = False
        if username:
            raise ValueError("Users must have an email address")
        user = self.model(username=username, **kwargs)
        user.set_password(kwargs['password'])
        user.save(self._db)
        return user

    def create_superuser(self, username: str, **kwargs):
        kwargs['is_active'] = True
        kwargs['is_admin'] = True
        user = self.model(
            username=username,
            **kwargs
        )
        user.set_password(kwargs['password'])
        user.save()
        return user

class   User(AbstractBaseUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=150)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    otp_secret = models.CharField(max_length=32, default=pyotp.random_base32)
    two_fa_enabled = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    avatar_url = models.URLField(max_length=200, null=True, blank=True)
    wins = models.PositiveSmallIntegerField(default=0)
    loses = models.PositiveSmallIntegerField(default=0)
    rating = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=500)
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


    objects = UserManager()

    @property
    def is_staff(self) -> bool:
        return self.is_admin

    @property
    def otp_uri(self):
        return pyotp.TOTP(self.otp_secret).provisioning_uri(
            name=str(self.username), issuer_name='transcendance',
        )

    def verify_otp(self, otp_code) -> bool:
        return pyotp.TOTP(self.otp_secret).verify(otp_code)

    def __str__(self) -> str:
        return self.username

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
