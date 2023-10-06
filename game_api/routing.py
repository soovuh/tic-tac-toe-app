from django.urls import re_path
from core.consumers.search import SearchConsumer
from core.consumers.game import GameConsumer

websocket_urlpatterns = [
    re_path(r'search/', SearchConsumer.as_asgi()),
    re_path(r'ws/game/(?P<game_code>\w+)/$', GameConsumer.as_asgi()),
]
