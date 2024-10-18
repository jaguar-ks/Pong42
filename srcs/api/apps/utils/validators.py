from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.validators import MinLengthValidator, MaxLengthValidator
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
        if len(value) < 2:
            raise serializers.ValidationError(f"{self.field_name} must be at least 2 characters long.")
        if len(value) > 30:
            raise serializers.ValidationError(f"{self.field_name} must not exceed 30 characters.")
        if not value.isalpha():
            raise serializers.ValidationError(f"{self.field_name} should only contain alphabetic characters.")

class UsernameValidator:
    def __call__(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")

class EmailValidator:
    def __call__(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")


