import asyncio
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
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
        count = getattr(self.channel_layer, self.game_group_code, 0)
        if not count:
            setattr(self.channel_layer, self.game_group_code, 1)
        else:
            setattr(self.channel_layer, self.game_group_code, count + 1)
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        count = getattr(self.channel_layer, self.game_group_code, 0)
        data = json.loads(text_data)
        action = data.get('action')
        if action == 'start':
            if count == 2:
                await self.channel_layer.group_send(
                    self.game_group_code,
                    {
                        'type': 'game_start',
                    }
                )
            else:
                asyncio.create_task(self.wait_for_match())
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
        if action == 'surr':
            player = data.get('player')
            uid = data.get('uid')
            await self.game_over_surr(player)

            await self.channel_layer.group_send(
                self.game_group_code,
                {
                    'type': 'game_surr',
                    'player': player,
                    'uid': uid,
                }
            )

    async def disconnect(self, code):
        count = getattr(self.channel_layer, self.game_group_code, 0)
        setattr(self.channel_layer, self.game_group_code, count - 1)
        if count == 1:
            delattr(self.channel_layer, self.game_group_code)

    async def game_surr(self, event):
        player = event['player']
        uid = event['uid']
        await self.send(text_data=json.dumps({
            'action': 'surr',
            'player': player,
            'uid': uid,
        }))

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

    async def wait_for_match(self):
        count = getattr(self.channel_layer, self.game_group_code, 0)
        while count < 2:
            if count == 0:
                return
            count = getattr(self.channel_layer, self.game_group_code, 0)
            await asyncio.sleep(1)
        await self.channel_layer.group_send(
            self.game_group_code,
            {
                'type': 'game_start',
            }
        )

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

    @database_sync_to_async
    def game_over_surr(self, surr):
        game = Game.objects.get(game_code=self.game_code)
        if game.is_friend_game:
            if surr == 'x':
                game.winner = 'o'
            elif surr == 'o':
                game.winner = 'x'
            game.is_over = True
            game.save()
            return
        if game.is_over:
            return
        game.is_over = True
        if surr == 'x':
            game.winner = 'o'
        elif surr == 'o':
            game.winner = 'x'
        game.save()
        uxid = game.x_player_id
        uoid = game.o_player_id
        user_x = User.objects.get(id=uxid)
        user_o = User.objects.get(id=uoid)
        user_x.games += 1
        user_o.games += 1
        if game.winner == 'x':
            user_x.wins += 1
        elif game.winner == 'o':
            user_o.wins += 1
        user_x.save()
        user_o.save()
