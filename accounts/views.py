from django.db.models import F, ExpressionWrapper, FloatField, Case, When, Value
from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny

from accounts.serializers import TopListSerializer

from accounts.models import UserAccount as User


class TopListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.annotate(
        win_rate=ExpressionWrapper(
            Case(
                When(games=0, then=Value(0.0)),
                default=F('wins') * 100.0 / F('games'),
                output_field=FloatField(),
            ),
            output_field=FloatField(),
        )
    )
    serializer_class = TopListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.OrderingFilter]

    ordering_fields = ['games', 'wins', 'win_rate', 'name']
    ordering = ['-games']