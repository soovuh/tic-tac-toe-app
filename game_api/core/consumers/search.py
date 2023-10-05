import asyncio
import json
import random


from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from core.models import Game

from accounts.models import UserAccount as User

connected_clients = []
users = []


class SearchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        user_id = data.get('user_id')
        action = data.get('action')
        if action == 'search':
            if user_id not in users:
                self.user = await self.get_user(user_id)
                users.append(self.user)
                print(self.user)
                connected_clients.append(self)
                if len(users) >= 2:
                    await self.match_users()
                else:
                    asyncio.create_task(self.wait_for_match())
            else:
                await self.close()
        elif action == 'close':
            users.remove(self.user)
            connected_clients.remove(self)
            await self.close()

    async def wait_for_match(self):
        while len(users) < 2:
            if len(users) == 0:
                return
            await asyncio.sleep(2)
        await self.match_users()

    async def match_users(self):
        opponent1 = connected_clients.pop(0)
        opponent2 = connected_clients.pop(0)

        user_1 = users.pop(0)
        user_2 = users.pop(0)

        x_player = random.choice([user_1, user_2])
        if x_player == user_1:
            o_player = user_2
        else:
            o_player = user_1

        game = await self.create_game(x_player, o_player)
        code = game.game_code
        await opponent1.send(text_data=json.dumps({
            'code': code
        }))
        await opponent2.send(text_data=json.dumps({
            'code': code
        }))
        await opponent1.close()
        await opponent2.close()

    @database_sync_to_async
    def create_game(self, x_player_id, o_player_id):
        game = Game.objects.create(x_player=x_player_id, o_player=o_player_id)
        return game

    @database_sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(id=user_id)
        return user
