import json

from django.contrib.auth import get_user_model
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from django.views.decorators.csrf import csrf_exempt

from core.models import Game

User = get_user_model()


class GameViewSet(ViewSet):
    @csrf_exempt
    @action(detail=False, methods=['post'])
    def check_game(self, request):
        game_code = request.data.get('game_code')
        user_id = request.data.get('uid')
        try:
            game = Game.objects.get(game_code=game_code)
            user = User.objects.get(id=user_id)
            if game.is_over:
                return Response({"player": "n"}, status=400)
            if game.x_player.id == user.id:
                return Response({"player": "x"}, status=200)
            if game.o_player.id == user.id:
                return Response({"player": "o"}, status=200)
            return Response({"player": "n"}, status=400)
        except:
            return Response({"player": "n"}, status=400)
