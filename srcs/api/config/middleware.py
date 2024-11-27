from django.http import parse_cookie
from django.conf import settings
from rest_framework_simplejwt.tokens import SlidingToken
from django.contrib.auth.models import AnonymousUser

from apps.users.models import User


class WebSocketJWTMiddleware:
    """
    Middleware class for handling WebSocket connections with JWT authentication.

    This middleware extracts the JWT token from the incoming WebSocket request's cookies,
    verifies the token, and sets the authenticated user in the scope for further processing.

    Attributes:
        inner: The inner middleware or application to call after processing the WebSocket request.

    Methods:
        __call__: The method called when a WebSocket connection is established.
        get_user_from_token: Retrieves the user object from the JWT token.

    """

    def __init__(self, inner) -> None:
        self.inner = inner

    def __call__(self, scope, receive, send):

        scope["user"] = AnonymousUser()

        for header, value in scope.get("headers", []):
            if header == b"cookie":
                cookies = parse_cookie(value.decode())
                scope["cookies"] = cookies
                jwt_token = cookies.get(settings.AUTH_TOKEN_NAME)
                scope["user"] = self.get_user_from_token(jwt_token)
                break

        return self.inner(scope, receive, send)

    def get_user_from_token(self, jwt_token):
        """
        Retrieves the user object from the JWT token.

        Args:
            jwt_token: The JWT token extracted from the WebSocket request's cookies.

        Returns:
            The authenticated user object if the token is valid, otherwise an AnonymousUser object.

        """
        try:
            token = SlidingToken(jwt_token)
            token.verify()
            user_id = token.get(settings.SIMPLE_JWT["USER_ID_CLAIM"])
            return User.objects.filter(is_active=True, is_email_verified=True).get(
                id=user_id
            )
        except:
            return AnonymousUser()
