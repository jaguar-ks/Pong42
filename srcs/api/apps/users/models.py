from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import pyotp
from django.core.exceptions import ValidationError
from django.db.models import Q

class   UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **kwargs):

        kwargs.setdefault('is_active', True)
        kwargs.setdefault('is_email_verified', False)
        kwargs.setdefault('is_admin', False)

        if not username:
            raise ValueError('username is required')
        if not email:
            raise ValueError('email address is required')

        user = self.model(
            username=username,
            email=email,
            **kwargs
        )
        user.set_password(password)
        user.full_clean()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **kwargs):
        kwargs.setdefault('is_active', True)
        kwargs.setdefault('is_email_verified', True)
        kwargs.setdefault('is_admin', True)
        return self.create_user(
            username=username,
            email=email,
            password=password,
            **kwargs
        )

class   User(AbstractBaseUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=150, unique=True)
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
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

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

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    def get_all_permissions(self):
        return []


class   Connection(models.Model):
    PENDING = 'pending'
    FRIENDS = 'friends'
    BLOCKED = 'blocked'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (FRIENDS, 'Friends'),
        (BLOCKED, 'Blocked'),
    ]

    initiator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='as_initiator', null=False, blank=False)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='as_recipient', null=False, blank=False)
    status = models.CharField(max_length=7, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class   Meta:
        unique_together = ('initiator', 'recipient')

    def clean(self) -> None:
        if self.initiator.pk == self.recipient.pk:
            raise ValidationError("initiator and recipient should not be the same")
