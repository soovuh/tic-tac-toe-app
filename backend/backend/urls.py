from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from . import routing

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('ws/', include(routing.websocket_urlpatterns)),
]

urlpatterns += [re_path(r'^,*', TemplateView.as_view(template_name='index.html'))]
