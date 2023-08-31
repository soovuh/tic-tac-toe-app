import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()


class LobbyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        user_id = data.get("user_id")
        user = await self.get_user(user_id)
        await self.send(text_data=json.dumps({
            'event': 'match_found',
            'opponent': 'Enemy',
        }))

    @database_sync_to_async
    def get_user(self, user_id):
        user = User.objects.get(id=user_id)
        return user


'''
    class ChatConsumer(AsyncWebsocketConsumer):
        async def connect(self):
            self.room_group_name = 'chat'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
    
        async def disconnect(self, close_code):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
        @database_sync_to_async
        def create_message(self, message, username):
            message_obj = Message.objects.create(
                content=message,
                username=username
            )
            return message_obj
    
        async def receive(self, text_data):
            data = json.loads(text_data)
            message = data['message']
            username = data['username']
    
            # Create a new message object and save it to the database
            message_obj = await self.create_message(message, username)
    
            # Send the message to the group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_obj.content,
                    'username': message_obj.username,
                    'timestamp': str(message_obj.timestamp)
                }
            )
    
        async def chat_message(self, event):
            message = event['message']
            username = event['username']
            timestamp = event['timestamp']
    
            # Send the message to the websocket
            await self.send(text_data=json.dumps({
                'message': message,
                'username': username,
                'timestamp': timestamp
            }))
'''
