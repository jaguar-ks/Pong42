from apps.users.models import User
from rest_framework import serializers
import requests
from rest_framework_simplejwt.tokens import SlidingToken

from apps.users.serializers import UserSerializer
from apps.users.models import User

class   BaseOauthSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=200, write_only=True)
    token = serializers.CharField(read_only=True, max_length=200)
    user = UserSerializer(read_only=True)

    def exchange_code_with_token(self, code):
        config = self.context['config']
        params = {
            'grant_type': 'authorization_code',
            'client_id': config['client_id'],
            'client_secret': config['client_secret'],
            'code': code,
            'redirect_uri': config['redirect_uri']
        }

        token_response = requests.post(
            url=config['token_url'],
            params=params
        )
        if token_response.status_code != 200:
            raise serializers.ValidationError('Failed to exchange code with token')
        return token_response.json()['access_token']

    def get_user_info(self, access_token):
        user_info_response = requests.get(
            url=self.context['config']['user_info_url'],
            headers={
                'Authorization': f'Bearer {access_token}',
            }
        )
        if user_info_response.status_code != 200:
            raise serializers.ValidationError('Failed to get user info from provider')
        return user_info_response.json()

    def extract_user_info(self, provider_user_info):
        raise NotImplemented("this method should be implemented in the derive class")

    def validate(self, attrs):
        access_token = self.exchange_code_with_token(code=attrs['code'])
        user_info = self.get_user_info(access_token=access_token)
        return self.extract_user_info(user_info)

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
        test_username = base_username
        counter = 1

        while User.objects.filter(username=test_username).exists():
            # First try combinations of first name + last name
            if counter <= len(first_name):
                test_username = f'{first_name[:counter]}{last_name}'
            else:
                # If all name combinations are taken, append numbers
                test_username = f'{base_username}{counter - len(first_name)}'
            counter += 1

        return test_username


    def create(self, validated_data: dict):
        validated_data.setdefault('is_active', True)
        validated_data.setdefault('is_email_verified', True)

        # generate unique username
        validated_data['username'] = self.generate_unique_username(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data.pop('username', None)
        )

        email = validated_data.pop('email')
        try:
            user, _ = User.objects.get_or_create(email=email, defaults=validated_data)
            token = SlidingToken.for_user(user=user)
            return {
                'token': str(token),
                'user': UserSerializer(user).data
            }
        except:
            raise serializers.ValidationError("sign-in failed please try another way")


class   FortyTwoOauthSerializer(BaseOauthSerializer):
    def extract_user_info(self, provider_user_info):
        return {
            'email': provider_user_info['email'],
            'username': provider_user_info['login'],
            'first_name': provider_user_info['first_name'],
            'last_name': provider_user_info['first_name'],
            'avatar_url': provider_user_info['image']['link'],
        }
