import os

import django
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

asgi_app = get_asgi_application()

from game_api import routing
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "game_api.settings")
django.setup()

application = ProtocolTypeRouter({
    "http": asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns
        )
    ),
})
