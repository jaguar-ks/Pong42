from django.contrib.auth import get_user_model
from rest_framework import serializers
import re
from django.contrib.auth import get_user_model

User = get_user_model()

class PasswordValidator:
    def __call__(self, value):
        errors = []
        if len(value) < 8 or len(value) > 30:
            errors.append("Password must be 8 to 30 characters long.")
        if not re.search(r'[A-Z]', value):
            errors.append("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            errors.append("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            errors.append("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            errors.append("Password must contain at least one special character.")
        if errors:
            raise serializers.ValidationError(errors)

class NameValidator:
    def __init__(self, field_name):
        self.field_name = field_name

    def __call__(self, value):
        errors = []
        if len(value) < 2 or len(value) > 50:
            errors.append(f"{self.field_name} must be 2 to 15 characters long.")
        if not value.isalpha():
            errors.append(f"{self.field_name} should only contain alphabetic characters.")
        if errors:
            raise serializers.ValidationError(errors)

class UsernameValidator:
    def __call__(self, value):
        errors = []

        if 30 < len(value) < 4:
            errors.append("Username must be 5 to 30 characters long.")
        if not re.match(r'^[A-Za-z0-9_-]+$', value):
            errors.append("Username can only contain letters, numbers, underscores, hyphens.")
        if value[0] in '_-' or value[-1] in '_-':
            errors.append("Username cannot start or end with an underscore, hyphen, or dot.")
        if any(bad in value for bad in ["__", "--", "_-", "-_"]):
            errors.append("Username cannot contain consecutive special characters like '__', '_-', or similar.")
        reserved_usernames = ['admin', 'root', 'superuser']
        if get_user_model().objects.filter(username=value).exists():
            errors.append("A user with that username already exists.")
        if value.lower() in reserved_usernames:
            errors.append("This username is reserved and cannot be used.")
        if errors:
            raise serializers.ValidationError(errors)

class EmailValidator:
    def __call__(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")


