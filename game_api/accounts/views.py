from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import TopListSerializer

User = get_user_model()


class TopListAPIView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):

        top_list = User.objects.order_by('-games', '-wins')

        serializer = TopListSerializer(top_list, many=True)
        return Response(serializer.data)
