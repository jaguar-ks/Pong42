from rest_framework.generics import ListAPIView

from apps.utils.mixins import AllUsersMixins
from .serializers import GameMatchSerializer
from .models import GameMatch
from django.db.models import Q
from django.http import Http404

class UserGameHistory(AllUsersMixins, ListAPIView):
    serializer_class = GameMatchSerializer

    def get_queryset(self):
        try:
            print(self.kwargs.get('user_id'))
            user = self.get_unblocked_users().get(
                pk=self.kwargs.get('user_id'),
            )
            return GameMatch.objects.filter(
                Q(player1=user) | Q(player2=user),
            ).select_related('player1', 'player2').order_by('-created_at')
        except Exception as e:
            raise Http404(f"No user found with the provided user ID")

