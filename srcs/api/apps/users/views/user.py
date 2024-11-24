from rest_framework import generics, filters, viewsets, mixins
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework.exceptions import ValidationError, PermissionDenied

from ..models import User, Connection
from . import serializers

class   AuthUserView(generics.RetrieveUpdateDestroyAPIView):

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return serializers.UpdateAuthUserSerializer
        return serializers.AuthUserSerializer

    def destroy(self, request, *args, **kwargs):
        request.user.is_active = False
        request.user.save()
        return Response({'detail': 'successfully deleted your account'})

    def get_object(self):
        return self.request.user

class   UserRetriveView(generics.RetrieveAPIView):
    serializer_class = serializers.UserDetailSerializer
    queryset = User.objects.filter(is_active=True)
    lookup_field = 'id'

class   ListUserView(generics.ListAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        return User.objects.filter(is_active=True)

class LeaderBoardView(generics.ListAPIView):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        return User.objects.filter(is_active=True).order_by('-rating')

class   UserSearchView(generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    filter_backends = [filters.SearchFilter]
    serializer_class = serializers.UserSerializer
    search_fields = ['username', 'email', 'first_name', 'last_name']
