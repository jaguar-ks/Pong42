import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from config.middleware import WebSocketJWTMiddleware
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.django.local")

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from django.urls import re_path
from apps.pongue.consumers import GameConsumer
from apps.users.consumers import ChatConsumer

async def unmatched_route(scope, receive, send):
    await send(
        {
            "type": "websocket.close",
            "code": 4004,
        }
    )


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            WebSocketJWTMiddleware(
                URLRouter(
                    [
                        re_path(r'ws/game/(?:(?P<room_name>[\w\-]+)/)?$', GameConsumer.as_asgi()),
                        re_path(r'ws/chat/$', ChatConsumer.as_asgi()),
                        re_path(r'', unmatched_route), # catch all unmatched routes
                    ]
                ),
            )
        ),
    }
)
