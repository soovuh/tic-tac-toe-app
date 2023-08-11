from django.contrib import admin
from django.urls import path
from rest_framework.routers import SimpleRouter

from core.views import TestViewSet

router = SimpleRouter()

router.register(r'api/test', TestViewSet, basename='test')

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns += router.urls
