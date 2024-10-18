from django.contrib.auth import get_user_model
from rest_framework import serializers
import re

User = get_user_model()

class PasswordValidator:
    def __call__(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one digit.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")

class NameValidator:
    def __init__(self, field_name):
        self.field_name = field_name

    def __call__(self, value):
        errors = []

        if User.objects.filter(username=value).exists():
            errors.append("A user with that username already exists.")

        if 30 < len(value) < 4:
            errors.append("Username must be 5 to 30 characters long.")
        if not re.match(r'^[A-Za-z0-9_-]+$', value):
            errors.append("Username can only contain letters, numbers, underscores, hyphens.")
        if value[0] in '_-' or value[-1] in '_-':
            errors.append("Username cannot start or end with an underscore, hyphen, or dot.")
        if any(bad in value for bad in ["__", "--", "_-", "-_"]):
            errors.append("Username cannot contain consecutive special characters like '__', '_-', or similar.")
        reserved_usernames = ['admin', 'root', 'superuser']
        if value.lower() in reserved_usernames:
            errors.append("This username is reserved and cannot be used.")
        if errors:
            raise serializers.ValidationError(errors)

class UsernameValidator:
    def __call__(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")

class EmailValidator:
    def __call__(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")


