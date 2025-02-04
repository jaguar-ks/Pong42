from rest_framework.generics import ListAPIView

from apps.utils.mixins import AllUsersMixins
from .serializers import GameMatchSerializer, RatingHistorySerializer
from .models import GameMatch, RatingHistory
from django.db.models import Q
from django.http import Http404


class UserGameHistory(AllUsersMixins, ListAPIView):
    serializer_class = GameMatchSerializer

    def get_queryset(self):
        try:
            users = self.get_unblocked_users()
            if users.count() == 0:
                return GameMatch.objects.none()
            user = users.get(
                pk=self.kwargs.get("user_id"),
            )

            return (
                GameMatch.objects.filter(
                    Q(player1=user) | Q(player2=user),
                )
                .select_related("player1", "player2")
                .order_by("-created_at")
            )
        except Exception as e:
            print(e)
            raise Http404(f"No user found with the provided user ID")


class UserRatingHistory(AllUsersMixins, ListAPIView):
    serializer_class = RatingHistorySerializer

    def get_queryset(self):
        try:
            users = self.get_unblocked_users()
            if users.count() == 0:
                return GameMatch.objects.none()
            user = users.get(
                pk=self.kwargs.get("user_id"),
            )
            return RatingHistory.objects.filter(user=user).order_by('-date')
        except Exception as e:
            raise Http404(f"No user found with the provided user ID")
