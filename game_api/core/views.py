from rest_framework.response import Response
from rest_framework.views import APIView


class GameAPIView(APIView):
    def post(self, request):
        print(request.data.get('game_code'))
        return Response({'all': 'ok'}, status=200)
