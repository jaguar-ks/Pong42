from apps.users.serializers import NotificationSerializer
from apps.users.models import Notification
from rest_framework import generics

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        notifs = Notification.get_notif(self.request.user)
        for notif in notifs:
            if notif.read == True:
                break
            notif.read = True
            notif.save()
        return notifs
