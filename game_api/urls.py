from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter

from accounts.views import TopListViewSet
from core.views import GameAPIView
from game_api import routing
from django.conf import settings
from django.views.static import serve


router = DefaultRouter()
router.register(r'top-list', TopListViewSet)

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/check_game/', csrf_exempt(GameAPIView.as_view())),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('ws/', include(routing.websocket_urlpatterns)),
    path('api/', include(router.urls)),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
]


urlpatterns += [re_path(r'^,*', TemplateView.as_view(template_name='index.html'))]

