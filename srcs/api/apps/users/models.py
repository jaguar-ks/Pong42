from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import pyotp
from django.core.exceptions import ValidationError
from django.db.models import Q
from django.utils import timezone
from config.envm import env


DEFAULT_ELO_RATING = 500.0


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **kwargs):

        kwargs.setdefault("is_active", True)
        kwargs.setdefault("is_email_verified", False)
        kwargs.setdefault("is_admin", False)

        if not username:
            raise ValueError("username is required")
        if not email:
            raise ValueError("email address is required")

        user = self.model(username=username, email=email, **kwargs)
        user.set_password(password)
        user.full_clean()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **kwargs):
        kwargs.setdefault("is_active", True)
        kwargs.setdefault("is_email_verified", True)
        kwargs.setdefault("is_admin", True)
        return self.create_user(
            username=username, email=email, password=password, **kwargs
        )


class User(AbstractBaseUser):
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(max_length=150, unique=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    otp_secret = models.CharField(max_length=32, default=pyotp.random_base32)
    two_fa_enabled = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)
    avatar_url = models.URLField(
        max_length=200, default=env("DEFAULT_PROFILE_IMAGE_URL"), null=True, blank=True
    )
    wins = models.PositiveSmallIntegerField(default=0)
    loses = models.PositiveSmallIntegerField(default=0)
    rating = models.FloatField(default=DEFAULT_ELO_RATING)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = UserManager()

    @property
    def is_staff(self) -> bool:
        return self.is_admin

    @property
    def otp_uri(self):
        return pyotp.TOTP(self.otp_secret).provisioning_uri(
            name=str(self.username),
            issuer_name="transcendance",
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


class Connection(models.Model):
    PENDING = "pending"
    FRIENDS = "friends"
    BLOCKED = "blocked"

    STATUS_CHOICES = [
        (PENDING, "Pending"),
        (FRIENDS, "Friends"),
        (BLOCKED, "Blocked"),
    ]

    initiator = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="as_initiator",
        null=False,
        blank=False,
    )
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="as_recipient",
        null=False,
        blank=False,
    )
    status = models.CharField(max_length=7, choices=STATUS_CHOICES, default=PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("initiator", "recipient")

    def clean(self) -> None:
        if self.initiator.pk == self.recipient.pk:
            raise ValidationError("initiator and recipient should not be the same")
        # Check for existing reverse connection
        if Connection.objects.filter(
            initiator=self.recipient, recipient=self.initiator
        ).exists():
            raise ValidationError("A connection already exists between these users")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"{self.initiator} 🤝 {self.recipient}"

    @classmethod
    def get_user_connections(cls, user):
        """
        Get all active connections for a user where they are not blocked.
        Returns connections where user is either initiator or recipient,
        excluding ones where they are blocked by someone else.
        """
        return cls.objects.filter(
            # User is either initiator or recipient
            (Q(initiator=user) | Q(recipient=user))
            &
            # For blocked connections, user must be initiator (they did the blocking)
            (~Q(status=cls.BLOCKED) | Q(status=cls.BLOCKED, initiator=user))
        ).select_related("initiator", "recipient")

    @classmethod
    def get_friends(cls, user):
        """
        Get all confirmed friends for a user.
        """
        return cls.objects.filter(
            (Q(initiator=user) | Q(recipient=user)) & Q(status=cls.FRIENDS)
        ).select_related("initiator", "recipient")

    @classmethod
    def get_pending_requests(cls, user):
        """
        Get all pending connection requests for a user.
        """
        return cls.objects.filter(recipient=user, status=cls.PENDING).select_related(
            "initiator"
        )

    @classmethod
    def get_sent_requests(cls, user):
        """
        Get all connection requests sent by a user.
        """
        return cls.objects.filter(initiator=user, status=cls.PENDING).select_related(
            "recipient"
        )

    @classmethod
    def get_blocked_users(cls, user):
        """
        Get all users blocked by this user.
        """
        return cls.objects.filter(initiator=user, status=cls.BLOCKED).select_related(
            "recipient"
        )

    @classmethod
    def get_blocked_ids(cls, user):
        users = cls.objects.filter(
            (Q(initiator=user) | Q(recipient=user)) & Q(status=cls.BLOCKED)
        ).values_list("initiator_id", "recipient_id")
        ans = set()
        for i, j in users:
            ans.add(i)
            ans.add(j)
        ans.discard(user.id)
        return ans

    def get_other_user(self, user):
        """
        Get the other user in the connection.
        """
        return self.recipient if self.initiator == user else self.initiator


class Message(models.Model):
    connection = models.ForeignKey(
        Connection, on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    content = models.TextField()
    timestamp = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.sender.username} to {self.connection.get_other_user(self.sender).username}: {self.content[:50]}"

    @classmethod
    def get_conversation(cls, connection):
        """Get all messages for a specific connection"""
        return cls.objects.filter(connection=connection).order_by("timestamp")


class Notification(models.Model):

    NOTIFICATION_TYPES = {
        "connections": "Connections",
        "messages": "Messages",
        "game": "Game",
    }

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )

    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.user} - {self.notification_type}"

    @classmethod
    def get_notif(cls, user):
        return cls.objects.filter(user=user).order_by("-created_at")
