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


# class SignUpSerializer(serializers.Serializer):
#     id = serializers.IntegerField(read_only=True)
#     username = serializers.CharField(validators=[UsernameValidator()])
#     email = serializers.EmailField(validators=[EmailValidator()])
#     password = serializers.CharField(write_only=True, validators=[PasswordValidator()])
#     first_name = serializers.CharField(validators=[NameValidator("First name")])
#     last_name = serializers.CharField(validators=[NameValidator("Last name")])

#     def validate(self, data):
#         if data.get('first_name') and data.get('last_name'):
#             if data['first_name'].lower() == data['last_name'].lower():
#                 raise serializers.ValidationError("First name and last name should not be the same.")
#         return data

#     def create(self, validated_data):
#         return User.objects.create_user(**validated_data)

#     def update(self, instance, validated_data):
#         for attr, value in validated_data.items():
#             if attr == 'password':
#                 instance.set_password(value)
#             else:
#                 setattr(instance, attr, value)
#         instance.save()
#         return instance