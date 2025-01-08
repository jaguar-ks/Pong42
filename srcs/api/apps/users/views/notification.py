from apps.users.serializers import NotificationSerializer
from apps.users.models import Notification
from rest_framework import generics

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.get_notif(self.request.user)
