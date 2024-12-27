import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from config.middleware import WebSocketJWTMiddleware
from apps.users import routing    
from channels.security.websocket import AllowedHostsOriginValidator
# from apps.chat import routing
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from apps.pongue.routing import ws_urlpatterns as pongue_urlpatterns

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            WebSocketJWTMiddleware(
                URLRouter(
                    [
                        *pongue_urlpatterns +
                        routing.websocket_urlpatterns
                    ]
                )
            )
        ),
    }
)
