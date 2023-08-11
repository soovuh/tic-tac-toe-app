from rest_framework.viewsets import ModelViewSet
from .models import TestModel
from .serializers import TestSerializer


class TestViewSet(ModelViewSet):
    queryset = TestModel.objects.all()
    serializer_class = TestSerializer
