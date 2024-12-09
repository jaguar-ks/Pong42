from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.tokens import SlidingToken
from rest_framework_simplejwt.exceptions import TokenError
from django.conf import settings

from apps.users.models import User


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Authenticate token and get user
        token = self._authenticate(request)
        if token:
            user = self._get_user_from_access_token(token)
            # Set attributes on the request
            setattr(request, "_auth", token)
            setattr(request, "_user", SimpleLazyObject(lambda: user))
            setattr(request, "is_authenticated_using_middleware", user is not None)

        response = self.get_response(request)

        return response

    def _authenticate(self, request):
        access_token = request.COOKIES.get(settings.AUTH_TOKEN_NAME)

        if not access_token:
            return None

        try:
            token = SlidingToken(access_token)
            return token
        except TokenError:
            return None

    def _get_user_from_access_token(self, validated_token):
        try:
            user_id = validated_token["user_id"]
            return User.objects.get(id=user_id, is_active=True)
        except User.DoesNotExist:
            return None


from rest_framework.authentication import BaseAuthentication


class SessionJWTAuth(BaseAuthentication):

    def authenticate(self, request):
        # Avoid recursive call by directly using the attributes set by middleware
        if getattr(request, "is_authenticated_using_middleware", False):
            return request._user, request._auth
        return None

    def authenticate_header(self, request):
        return "Set-Cookie: token"
