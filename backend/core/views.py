import json

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from django.views.decorators.csrf import csrf_exempt


class GameViewSet(ViewSet):
    @csrf_exempt
    @action(detail=False, methods=['post'])
    def check_game(self, request):
        game_code = request.data.get('game_code')
        user_id = request.data.get('uid')
        print(game_code)
        print(user_id)
        return Response({"All": "Ok"}, status=200)
