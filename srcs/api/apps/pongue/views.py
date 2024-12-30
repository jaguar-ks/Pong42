from rest_framework.response import Response
from rest_framework.generics import ListAPIView, RetrieveAPIView

from .serializers import (
    MatchSerializer,
    TournamentSerializer,
    TournamentDetailSerializer,
)
from .models import (
    PongMatch,
    Tournament,
)


class MatchHistoryView(ListAPIView):
    serializer_class = MatchSerializer
    queryset = PongMatch.objects.all()


class TournamentHistoryView(ListAPIView):
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.all()


class TournamentDetailView(RetrieveAPIView):
    serializer_class = TournamentDetailSerializer
    queryset = Tournament.objects.all()
    lookup_url_kwarg = "tournament_id"


class UserMatchHistoryView(ListAPIView):
    serializer_class = MatchSerializer

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return PongMatch.objects.filter(participants__user_id=user_id).order_by(
            "-played_at"
        )


class UserTournamentHistoryView(ListAPIView):
    serializer_class = TournamentSerializer

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return (
            Tournament.objects.filter(participants__user_id=user_id)
            .select_related('winner', 'creator')
            .order_by("-ended_at", "-created_at")
        )
