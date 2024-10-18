from rest_framework import generics, filters
from .serializers import AuthUserSerializer
from rest_framework.permissions import AllowAny
from .models import User


class   AuthUserView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AuthUserSerializer

    def get_object(self):
        return self.request.user

class   ListUserView(generics.ListAPIView):
    serializer_class = AuthUserSerializer

    def get_queryset(self):
        return User.objects.filter(is_active=True)

class LeaderBoardView(generics.ListAPIView):
    serializer_class = AuthUserSerializer

    def get_queryset(self):
        return User.objects.filter(is_active=True).order_by('-rating')

class   UserSearchView(generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    filter_backends = [filters.SearchFilter]
    serializer_class = AuthUserSerializer
    search_fields = ['username', 'email', 'first_name', 'last_name']


"""
/api/users/me
/api/users/{user_id}
"""