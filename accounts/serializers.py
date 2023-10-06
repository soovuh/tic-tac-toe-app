from djoser.serializers import UserCreateSerializer
from rest_framework import serializers

from accounts.models import UserAccount as User



class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')


class TopListSerializer(serializers.ModelSerializer):
    win_rate = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'games', 'wins', 'win_rate')

    def get_win_rate(self, obj):
        if obj.games == 0:
            return 0.0
        return round((obj.wins / obj.games) * 100.0, 1)
