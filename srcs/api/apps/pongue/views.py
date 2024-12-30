from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .serializers import (
    MatchSerializer,
    TournamentSerializer,
    TournamentDetailSerializer
)
from .models import (
    PongMatch,
    Tournament
)

class   MatchHistoryView(ListAPIView):
    serializer_class = MatchSerializer
    queryset = PongMatch.objects.all()


class   TournamentHistoryView(ListAPIView):
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.all()


class   TournamentDetailView(RetrieveAPIView):
    serializer_class = TournamentDetailSerializer
    queryset = Tournament.objects.all()
    lookup_url_kwarg = 'tournament_id'
