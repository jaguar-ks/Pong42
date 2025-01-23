from django.utils.functional import SimpleLazyObject
from rest_framework_simplejwt.tokens import SlidingToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.authentication import BaseAuthentication
from django.conf import settings

from apps.users.models import User


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token, user = self._authenticate(request)
        if token:
            setattr(request, "_auth", token)
            setattr(request, "_user", SimpleLazyObject(lambda: user))
            setattr(request, "is_authenticated_using_middleware", True)

        response = self.get_response(request)

        if request.META.get("token_should_be_removed"):
            response.delete_cookie(settings.AUTH_TOKEN_NAME)

        return response

    def _authenticate(self, request):
        access_token = request.COOKIES.get(settings.AUTH_TOKEN_NAME)

        if not access_token:
            return None, None

        try:
            token = SlidingToken(access_token)
            user_id = token["user_id"]
            return token, User.objects.get(id=user_id, is_active=True)
        except (TokenError, User.DoesNotExist) as e:
            request.META["token_should_be_removed"] = True

        return None, None


class SessionJWTAuth(BaseAuthentication):

    def authenticate(self, request):
        # Avoid recursive call by directly using the attributes set by middleware
        if getattr(request, "is_authenticated_using_middleware", False):
            return request._user, request._auth
        return None

    def authenticate_header(self, request):
        return "Set-Cookie: token"
