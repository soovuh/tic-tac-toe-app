from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Game

User = get_user_model()


class GameAPIView(APIView):
    def post(self, request):
        game_code = request.data.get('game_code')
        uid = request.data.get('uid')
        try:
            user = User.objects.get(id=uid)
            game = Game.objects.get(game_code=game_code)
            if game.is_over:
                return Response({'player': 'n'}, status=400)
            if game.x_player.id == user.id:
                return Response({'player': 'x', 'game_code': game_code, 'uid': uid}, status=200)
            elif game.o_player.id == user.id:
                return Response({'player': 'o', 'game_code': game_code, 'uid': uid}, status=200)
            else:
                return Response({'player': 'n'}, status=400)
        except:
            return Response({'player': 'n'}, status=400)
