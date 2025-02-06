from rest_framework import serializers
from rest_framework_simplejwt.tokens import SlidingToken
from requests_oauthlib import OAuth2Session
from django.conf import settings
from django.http import Http404

from apps.users.models import User
from apps.users.serializers import UserSerializer


PROVIDERS_SETTINGS = settings.OAUTH_PROVIDERS_SETTINGS


class OauthAuthorizeSerializer(serializers.Serializer):
    provider_name = serializers.CharField(max_length=20)
    provider_icon = serializers.URLField()
    provider_url = serializers.URLField()


class OauthProvidersUrls(serializers.Serializer):
    providers = serializers.ListField(child=OauthAuthorizeSerializer())

    def to_representation(self, instance=None):
        providers = []

        for provider, config in PROVIDERS_SETTINGS.items():
            oauth_session = OAuth2Session(
                client_id=config["client_id"],
                redirect_uri=config["redirect_uri"],
                scope=config["scope"],
            )
            authorize_url, _ = oauth_session.authorization_url(
                url=config["authorize_url"],
            )
            providers.append(
                {
                    "provider_icon": config.get("icon", None),
                    "provider_name": provider,
                    "provider_url": authorize_url,
                }
            )

        return {"providers": providers}


class OauthCallBackSerializer(serializers.Serializer):
    code = serializers.CharField(write_only=True, required=False)
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
        base_username = (
            username if username is not None else f"{first_name[0]}{last_name}"
        )

        # Try initial username
        unique_username = base_username
        counter = 1

        while User.objects.filter(username=unique_username).exists():
            # First try combinations of first name + last name
            if counter <= len(first_name):
                unique_username = f"{first_name[:counter]}{last_name}"
            else:
                # If all name combinations are taken, append numbers
                unique_username = f"{base_username}{counter - len(first_name)}"
            counter += 1

        return unique_username

    def validate(self, attrs):
        provider = self.context["provider"]
        code = attrs.get('code', None)
        if not code:
            raise Exception(f"failed to sign-in using {provider} oauth")
        config = PROVIDERS_SETTINGS.get(provider)
        if not config:
            raise Http404(f"provider {provider} not implemented")

        # Create new OAuth session for token exchange
        oauth_session = OAuth2Session(
            client_id=config["client_id"],
            redirect_uri=config["redirect_uri"],
            scope=config["scope"],
        )

        try:
            oauth_session.fetch_token(
                token_url=config["token_url"],
                code=attrs["code"],
                client_secret=config["client_secret"],
                include_client_id=True,
            )
        except Exception as e:
            raise Exception(f"Token exchange failed: {str(e)}")
        # Fetch user info
        try:
            user_info_response = oauth_session.get(config["user_info_url"])
            user_info_response.raise_for_status()
            user_info = user_info_response.json()
            return self.extract_user_info(user_info, config["user_info_kwargs"])
        except Exception as e:
            raise Exception(f"Failed to fetch user info: {str(e)}")

    def extract_user_info(self, user_info, keys):
        data = {}

        for attr, key in keys:
            # Handle nested keys with dot notation
            value = user_info
            for part in key.split("."):
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
        email = validated_data.pop("email", None)
        if not email:
            raise Exception(
                f"Your provider {self.context['provider']} does not provide email"
            )

        validated_data.setdefault("is_active", True)
        validated_data.setdefault("is_email_verified", True)

        if "full_name" in validated_data:
            full_name = validated_data.pop("full_name")
            if full_name.count(" ") > 0:
                first_name, last_name = full_name.split(" ", 1)
            else:
                first_name = full_name
                last_name = ""
            validated_data["first_name"] = first_name.strip()
            validated_data["last_name"] = last_name.strip()

        # generate unique username
        validated_data["username"] = self.generate_unique_username(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            username=validated_data.pop("username", None),
        )

        try:
            user, _ = User.objects.get_or_create(email=email, defaults=validated_data)
            token = SlidingToken.for_user(user=user)
            return {"token": str(token), "user": UserSerializer(user).data}
        except Exception:
            raise Exception(
                "sign-in failed please try another way, or contact support"
            )
