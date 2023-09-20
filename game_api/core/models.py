import random
import string

from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


def generate_unique_code():
    length = 6
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Game.objects.filter(game_code=code).count() == 0:
            break
    return code


class Game(models.Model):
    game_code = models.CharField(max_length=6, default=generate_unique_code, unique=True)
    x_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='x_games')
    o_player = models.ForeignKey(User, on_delete=models.CASCADE, related_name='o_games')
    is_over = models.BooleanField(default=False)
    winner = models.CharField(default='n', max_length=1)
    is_friend_game = models.BooleanField(default=False)


    def __str__(self):
        return self.game_code
