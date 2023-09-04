from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from core.consumers import SearchConsumer

websocket_urlpatterns = [
    re_path(r'search/', SearchConsumer.as_asgi()),
]