from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.shortcuts import get_object_or_404
from django.http import Http404
from django.db.models import Q

from apps.users import serializers
from apps.users.models import Connection, User


class ConnectionViewSet(
    viewsets.GenericViewSet,
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
):

    serializer_class = serializers.ConnectionSerializer
    queryset = Connection.objects.all()

    STATUS_QUERIESETS = {
        "all": lambda user: Connection.get_user_connections(user=user),
        "friends": lambda user: Connection.get_friends(user=user),
        "pending": lambda user: Connection.get_pending_requests(user=user),
        "send_requests": lambda user: Connection.get_sent_requests(user=user),
        "blocked": lambda user: Connection.get_blocked_users(user=user),
    }

    def get_queryset(self):
        """
        Override get_queryset to filter connections based on status parameter
        """
        user = self.request.user
        if self.action == "list":
            status_param = self.request.GET.get("status", "all")
            if status_param not in self.STATUS_QUERIESETS:
                valid_status = ", ".join(self.STATUS_QUERIESETS.keys())
                raise ValidationError(
                    f"Invalid status {status_param}. valid options are: {valid_status}"
                )
            return self.STATUS_QUERIESETS[status_param](user=user)
        return self.queryset

    def get_connection(self):
        """Get connection object and verify user's permission to modify it"""
        connection = get_object_or_404(Connection, pk=self.kwargs["pk"])
        user = self.request.user

        if user not in [connection.initiator, connection.recipient]:
            raise PermissionDenied(
                "You don't have permission to modify this connection"
            )
        return connection, user

    def perform_create(self, serializer):
        """Set the initiator to the current user when creating a connection"""
        serializer.save(initiator=self.request.user, status=Connection.PENDING)

    @action(detail=True, methods=["get"])
    def accept(self, request, pk=None):
        """Accept a pending connection request"""
        connection, user = self.get_connection()

        if connection.status != Connection.PENDING:
            raise ValidationError("Can only accept pending connections")
        if user != connection.recipient:
            raise PermissionDenied("Only the recipient can accept connection requests")

        connection.status = Connection.FRIENDS
        connection.save()

        return Response(
            {
                "message": "Connection request accepted",
                "connection": self.get_serializer(connection).data,
            }
        )

    @action(detail=False, methods=["post"])
    def block(self, request):
        """
        Block a user by user_id
        Expects: {"user_id": <id>}
        """
        user_id = request.data.get("recipient_id")
        if not user_id:
            raise ValidationError("user_id is required")

        user_to_block = get_object_or_404(User, id=user_id)
        current_user = request.user

        if user_to_block == current_user:
            raise ValidationError("You cannot block yourself")

        # find any existing connection between the users
        connection = Connection.objects.filter(
            (Q(initiator=current_user) & Q(recipient=user_to_block))
            | (Q(initiator=user_to_block) & Q(recipient=current_user))
        ).first()

        if connection and connection.status == Connection.BLOCKED:
            if connection.recipient == current_user:
                raise PermissionDenied("Failed to perform this action")
            return Response(
                {
                    "message": "Connection already blocked",
                    "connection": self.get_serializer(connection).data,
                }
            )

        if connection:
            connection.delete()

        new_conn = Connection.objects.create(
            initiator=current_user, recipient=user_to_block, status=Connection.BLOCKED
        )

        return Response(
            {
                "message": "User blocked",
                "connection": self.get_serializer(new_conn).data,
            }
        )

    def destroy(self, request, *args, **kwargs):
        """Handle reject/cancel/remove/unblock actions by deleting the connection"""
        connection, user = self.get_connection()

        if connection.status == Connection.BLOCKED and connection.recipient == user:
            raise PermissionDenied("Cannot remove a connection where you are blocked")

        connection.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
