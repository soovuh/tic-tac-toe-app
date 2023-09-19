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
        print(self.game_group_code)
        await self.channel_layer.group_add(
            self.game_group_code,
            self.channel_name
        )
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        uid = data.get('uid')
        action = data.get('action')
        game_code = data.get('game_code')
        player = data.get('player')
        print(action, uid, game_code, player)
