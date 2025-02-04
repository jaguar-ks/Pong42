from rest_framework import generics, filters
from drf_spectacular.utils import extend_schema_view, extend_schema

from apps.users.models import User
from apps.users.serializers import (
    AuthUserSerializer,
    UpdateAuthUserSerializer,
    UserSerializer,
    UserDetailSerializer,
)
from apps.users.docs import (
    AUTH_USER_VIEW_SCHEMA,
    USER_RETRIEVE_SCHEMA,
    USER_LIST_SCHEMA,
    LEADER_BOARD_SCHEMA,
    USER_SEARCH_SCHEMA,
)
from apps.utils.mixins import AllUsersMixins


class UserListView(AllUsersMixins, generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.get_unblocked_users()


@extend_schema_view(**AUTH_USER_VIEW_SCHEMA)
class AuthUserView(generics.RetrieveUpdateDestroyAPIView):

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return UpdateAuthUserSerializer
        return AuthUserSerializer

    def get_object(self):
        return self.request.user


@extend_schema_view(**USER_RETRIEVE_SCHEMA)
class UserRetriveView(AllUsersMixins, generics.RetrieveAPIView):
    serializer_class = UserDetailSerializer
    lookup_field = "id"

    def get_queryset(self):
        return self.get_unblocked_users()


@extend_schema(**USER_LIST_SCHEMA)
class ListUserView(AllUsersMixins, generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.get_unblocked_users()


@extend_schema(**LEADER_BOARD_SCHEMA)
class LeaderBoardView(AllUsersMixins, generics.ListAPIView):
    serializer_class = UserSerializer

    def get_queryset(self):
        return self.get_unblocked_users().order_by("-rating")


@extend_schema(**USER_SEARCH_SCHEMA)
class UserSearchView(AllUsersMixins, generics.ListAPIView):
    filter_backends = [filters.SearchFilter]
    serializer_class = UserSerializer
    search_fields = ["username", "email", "first_name", "last_name"]

    def get_queryset(self):
        return self.get_unblocked_users().exclude(id=self.request.user.id)
