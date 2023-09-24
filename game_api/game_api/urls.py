from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView

from accounts.views import TopListAPIView
from core.views import GameAPIView
from . import routing


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/check_game/', csrf_exempt(GameAPIView.as_view())),
    path('api/get_toplist/', TopListAPIView.as_view()),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('ws/', include(routing.websocket_urlpatterns)),
]


urlpatterns += [re_path(r'^,*', TemplateView.as_view(template_name='index.html'))]



