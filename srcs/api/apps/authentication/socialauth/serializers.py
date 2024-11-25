from rest_framework import serializers
from rest_framework_simplejwt.tokens import SlidingToken
from requests_oauthlib import OAuth2Session
from django.conf import settings
from django.http import Http404

from apps.users.models import User
from apps.users.serializers import UserSerializer


PROVIDERS_SETTINGS = settings.OAUTH_PROVIDERS_SETTINGS

class   OauthAuthorizeSerializer(serializers.Serializer):
    authorization_url = serializers.CharField(max_length=250)

    def to_representation(self, instance):
        provider = self.context['provider']
        config = PROVIDERS_SETTINGS.get(provider, None)
        if not config:
            raise Http404(f"provider {provider} not implemented")

        oauth_session = OAuth2Session(
            client_id=config['client_id'],
            redirect_uri=config['redirect_uri'],
            scope=config['scope'],
        )

        authorize_url, _ = oauth_session.authorization_url(
            url=config['authorize_url'],
        )
        return {
            'authorization_url': authorize_url
        }


class   OauthCallBackSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=200, write_only=True)
    user = UserSerializer(read_only=True)
    token = serializers.CharField(max_length=200, read_only=True)


    def generate_unique_username(self, first_name, last_name, username=None):
        """
        Generate a unique username based on first and last name.
        Falls back to adding numbers if name combinations are taken.
        """
        # Normalize and clean the input names
        first_name = first_name.lower().strip()
        last_name = last_name.lower().strip()

        # Use provided username or create default
        base_username = username if username is not None else f'{first_name[0]}{last_name}'

        # Try initial username
        unique_username = base_username
        counter = 1

        while User.objects.filter(username=unique_username).exists():
            # First try combinations of first name + last name
            if counter <= len(first_name):
                unique_username = f'{first_name[:counter]}{last_name}'
            else:
                # If all name combinations are taken, append numbers
                unique_username = f'{base_username}{counter - len(first_name)}'
            counter += 1

        return  unique_username

    def validate(self, attrs):
        provider = self.context['provider']
        config = PROVIDERS_SETTINGS.get(provider)
        if not config:
            raise Http404(f"provider {provider} not implemented")

        # Create new OAuth session for token exchange
        oauth_session = OAuth2Session(
            client_id=config['client_id'],
            redirect_uri=config['redirect_uri'],
            scope=config['scope']
        )

        try:
            oauth_session.fetch_token(
                token_url=config['token_url'],
                code=attrs['code'],
                client_secret=config['client_secret'],
                include_client_id=True
            )
        except Exception as e:
            raise serializers.ValidationError(f'Token exchange failed: {str(e)}')
        # Fetch user info
        try:
            user_info_response = oauth_session.get(config['user_info_url'])
            user_info_response.raise_for_status()
            user_info = user_info_response.json()
            return self.extract_user_info(user_info, config['user_info_kwargs'])
        except Exception as e:
            raise serializers.ValidationError(f'Failed to fetch user info: {str(e)}')

    def extract_user_info(self, user_info, keys):
        data = {}

        for attr, key in keys:
            # Handle nested keys with dot notation
            value = user_info
            for part in key.split('.'):
                try:
                    value = value.get(part)
                    if value is None:
                        break
                except (AttributeError, KeyError):
                    value = None
                    break
            data[attr] = value

        return data

    def create(self, validated_data: dict):
        email = validated_data.pop('email', None)
        if not email:
            raise serializers.ValidationError(f"Your provider {self.context['provider']} does not provide email")

        validated_data.setdefault('is_active', True)
        validated_data.setdefault('is_email_verified', True)

        # generate unique username
        validated_data['username'] = self.generate_unique_username(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data.pop('username', None)
        )

        try:
            user, _ = User.objects.get_or_create(email=email, defaults=validated_data)
            token = SlidingToken.for_user(user=user)
            return {
                'token': str(token),
                'user': UserSerializer(user).data
            }
        except Exception:
            raise serializers.ValidationError("sign-in failed please try another way, or contact support")
