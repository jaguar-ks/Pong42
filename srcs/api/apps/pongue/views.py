from rest_framework.response import Response
from rest_framework.generics import ListAPIView

from .serializers import (
    MatchSerializer
)
from .models import (
    PongMatch
)

class   MatchHistoryView(ListAPIView):
    serializer_class = MatchSerializer
    queryset = PongMatch.objects.all()

