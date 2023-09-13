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
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        action = data.get('action')
        if action == "connect":
            game_code = data.get('game_code')
            uid = data.get('uid')
            player = data.get('player')
            self.room_name = game_code
            self.room_group_name = f'room_{self.room_name}'
            async_to_sync(self.channel_layer.group.add)(
                self.room_group_name,
                self.channel_name,
            )

