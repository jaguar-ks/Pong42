
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, PermissionDenied
from django.shortcuts import get_object_or_404


from apps.users import serializers
from apps.users.models import Connection


class ConnectionViewSet(viewsets.GenericViewSet,
                       mixins.CreateModelMixin,
                       mixins.ListModelMixin,
                       mixins.DestroyModelMixin):

    serializer_class = serializers.ConnectionSerializer
    queryset = Connection.objects.all()

    STATUS_QUERIESETS = {
        'all': lambda user: Connection.get_user_connections(user=user),
        'friends': lambda user: Connection.get_friends(user=user),
        'pending': lambda user: Connection.get_pending_requests(user=user),
        'send_requests': lambda user: Connection.get_sent_requests(user=user),
        'blocked': lambda user: Connection.get_blocked_users(user=user),
    }

    def get_queryset(self):
        """
        Override get_queryset to filter connections based on status parameter
        """
        user = self.request.user
        if self.action == 'list':
            status_param = self.request.GET.get('status', 'all')
            if status_param not in self.STATUS_QUERIESETS:
                valid_status = ", ".join(self.STATUS_QUERIESETS.keys())
                raise ValidationError(
                    f'Invalid status {status_param}. valid options are: {valid_status}'
                )
            return self.STATUS_QUERIESETS[status_param](user=user)
        return self.queryset

    def get_connection(self):
        """Get connection object and verify user's permission to modify it"""
        connection = get_object_or_404(Connection, pk=self.kwargs['pk'])
        user = self.request.user

        if user not in [connection.initiator, connection.recipient]:
            raise PermissionDenied("You don't have permission to modify this connection")
        return connection, user

    def perform_create(self, serializer):
        """Set the initiator to the current user when creating a connection"""
        serializer.save(initiator=self.request.user, status=Connection.PENDING)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept a pending connection request"""
        connection, user = self.get_connection()

        if connection.status != Connection.PENDING:
            raise ValidationError("Can only accept pending connections")
        if user != connection.recipient:
            raise PermissionDenied("Only the recipient can accept connection requests")

        connection.status = Connection.FRIENDS
        connection.save()

        return Response({
            "message": "Connection request accepted",
            "connection": self.get_serializer(connection).data
        })

    @action(detail=False, methods=['post'])
    def block(self, request, pk=None):
        """Block a user"""
        connection, user = self.get_connection()

        # If there's an existing connection, modify it
        if connection.status == Connection.BLOCKED and connection.initiator == user:
            raise ValidationError("User is already blocked")

        # If user is recipient in existing connection, create new blocked connection
        if connection.recipient == user:
            # Delete existing connection and create new one with user as initiator
            connection.delete()
            connection = Connection.objects.create(
                initiator=user,
                recipient=connection.initiator,
                status=Connection.BLOCKED
            )
        else:
            connection.status = Connection.BLOCKED
            connection.save()

        return Response({
            "message": "User blocked",
            "connection": self.get_serializer(connection).data
        })

    @action(detail=True, methods=['post'])
    def unblock(self, request, pk=None):
        """Unblock a user"""
        connection, user = self.get_connection()

        if connection.status != Connection.BLOCKED:
            raise ValidationError("Connection is not blocked")
        if connection.initiator != user:
            raise PermissionDenied("Only the blocker can unblock")

        connection.status = Connection.PENDING
        connection.save()

        return Response({
            "message": "User unblocked",
            "connection": self.get_serializer(connection).data
        })

    def destroy(self, request, *args, **kwargs):
        """Handle reject/cancel/remove actions by deleting the connection"""
        connection, user = self.get_connection()

        if connection.status == Connection.BLOCKED and connection.recipient == user:
            raise PermissionDenied("Cannot remove a connection where you are blocked")

        connection.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
