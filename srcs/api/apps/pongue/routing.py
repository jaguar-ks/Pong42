from django.urls import re_path

from . import consumers

ws_urlpatterns = [
    re_path('ws/pongue/$', consumers.PongueConsumer.as_asgi()),
]
