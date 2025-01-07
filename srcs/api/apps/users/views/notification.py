from apps.users.serializers import NotificationSerializer
from apps.users.models import Notification
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission = ["is_authenticated"]
    
    def get_queryset(self):
        return Notification.get_notif(self.request.user)
