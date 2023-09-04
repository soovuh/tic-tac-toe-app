import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

connected_clients = []
users = []


class SearchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        self.state = 'work'
        data = json.loads(text_data)
        user_id = data.get('user_id')
        action = data.get('action')
        if action == 'search':
            if user_id not in users:
                self.user = self.get_user(user_id)
                users.append(user_id)
                connected_clients.append(self)
                if len(users) >= 2:
                    await self.match_users()
                else:
                    asyncio.create_task(self.wait_for_match())
            else:
                # while user_id in users:
                #     users.remove(user_id)
                await self.close()
        elif action == 'close':
            users.remove(user_id)
            connected_clients.remove(self)
            await self.close()

    async def disconnect(self, code):
        print('disconnect')

    async def wait_for_match(self):
        while len(users) < 2:
            if len(users) == 0:
                return
            await asyncio.sleep(2)
        await self.match_users()

    async def match_users(self):
        opponent1 = connected_clients.pop(0)
        opponent2 = connected_clients.pop(0)

        opponent1_id = opponent1.user.id
        opponent2_id = opponent2.user.id

        print(users)
        users.remove(opponent1_id)
        users.remove(opponent2_id)
        print(users)


    @database_sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(id=user_id)
        return user
