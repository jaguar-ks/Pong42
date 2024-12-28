from django.http import parse_cookie
from django.conf import settings
from rest_framework_simplejwt.tokens import SlidingToken
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware


from apps.users.models import User


class WebSocketJWTMiddleware:
    def __init__(self, inner) -> None:
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Parse cookies
        cookies = {}
        for header, value in scope.get("headers", []):
            if header == b"cookie":
                cookies = parse_cookie(value.decode())

        # Get JWT token from cookies
        jwt_token = cookies.get(settings.AUTH_TOKEN_NAME)

        # add user to scope
        scope["user"] = await self.get_user(jwt_token)

        # refuse the connection if user not authenticated
        if not scope["user"].is_authenticated:
            await send({
                "type": "websocket.close",
                "code": 4001,
            })
            return

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user(self, jwt_token=None):
        if not jwt_token:
            return AnonymousUser()
        try:
            token = SlidingToken(jwt_token)
            token.verify()
            user_id = token.get(settings.SIMPLE_JWT["USER_ID_CLAIM"])
            return User.objects.get(
                id=user_id,
                is_active=True,
                is_email_verified=True,
            )
        except:
            return AnonymousUser()
