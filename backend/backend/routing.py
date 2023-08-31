from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from core.consumers import LobbyConsumer

websocket_urlpatterns = [
    re_path(r'lobby/', LobbyConsumer.as_asgi()),
]