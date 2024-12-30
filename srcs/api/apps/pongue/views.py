from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from .serializers import (
    MatchSerializer,
    TournamentSerializer
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
