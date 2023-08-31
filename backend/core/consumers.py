import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

searching_users = []
waiting_users = []


class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        action = data.get("action")
        user_id = data.get("user_id")
        self.user = await self.get_user(user_id)
        if action == 'searching':
            searching_users.append(self)
            if len(searching_users) >= 2:
                await self.match_users()
            else:
                await self.wait_for_match()

    async def wait_for_match(self):
        waiting_users.append(self)
        while len(searching_users) < 2 and self in waiting_users:
            await asyncio.sleep(2)  # Adjust the sleep interval as needed

        if self in waiting_users:
            waiting_users.remove(self)
            await self.match_users()

    async def match_users(self):
        if len(searching_users) >= 2:
            opponent1 = searching_users.pop(0)
            opponent2 = searching_users.pop(0)

            opponent1_id = opponent1.user.id
            opponent2_id = opponent2.user.id

            await opponent1.send(text_data=json.dumps({
                'event': 'match_found',
                'opponent': {'id': opponent2_id, 'name': opponent2.user.name},
            }))
            await opponent2.send(text_data=json.dumps({
                'event': 'match_found',
                'opponent': {'id': opponent1_id, 'name': opponent1.user.name},
            }))

    @database_sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(id=user_id)
        return user
