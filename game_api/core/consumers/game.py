import asyncio
import json
import random

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

from core.models import Game

User = get_user_model()


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_code = self.scope['url_route']['kwargs']['game_code']
        self.game_group_code = 'GAME_' + self.game_code
        await self.channel_layer.group_add(
            self.game_group_code,
            self.channel_name
        )
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        action = data.get('action')
        if action == 'start':
            await self.channel_layer.group_send(
                self.game_group_code,
                {
                    'type': 'game_start',
                }
            )
        if action == 'turn':
            player = data.get('player')
            cell = data.get('cell')
            await self.channel_layer.group_send(
                self.game_group_code,
                {
                    'type': 'game_turn',
                    'player': player,
                    'cell': int(cell),
                }
            )
        if action == 'win':
            player = data.get('player')
            uid = data.get('uid')
            await self.game_over(player)
            await self.channel_layer.group_send(
                self.game_group_code,
                {
                    'type': 'game_win',
                    'player': player,
                    'uid': uid,
                }
            )
        if action == 'draw':
            await self.game_over('n')
            await self.channel_layer.group_send(
                self.game_group_code,
                {
                    'type': 'game_draw',
                }
            )

    async def game_draw(self, event):
        await self.send(text_data=json.dumps({
            'action': 'draw'
        }))


    async def game_win(self, event):
        player = event['player']
        uid = event['uid']

        await self.send(text_data=json.dumps({
            'action': 'win',
            'player': player,
            'uid': uid,
        }))


    async def game_turn(self, event):
        player = event['player']
        cell = event['cell']

        await self.send(text_data=json.dumps({
            'action': 'turn',
            'player': player,
            'cell': cell,
        }))

    async def game_start(self, event):
        await self.send(text_data=json.dumps({
            'action': 'start',
        }))

    @database_sync_to_async
    def game_over(self, winner):
        game = Game.objects.get(game_code=self.game_code)
        if game.is_friend_game:
            game.winner = winner
            game.is_over = True
            game.save()
            return
        if game.is_over:
            return
        game.is_over = True
        game.winner = winner
        game.save()
        uxid = game.x_player_id
        uoid = game.o_player_id
        user_x = User.objects.get(id=uxid)
        user_o = User.objects.get(id=uoid)
        user_x.games += 1
        user_o.games += 1
        if winner == 'x':
            user_x.wins += 1
        elif winner == 'o':
            user_o.wins += 1
        user_x.save()
        user_o.save()

