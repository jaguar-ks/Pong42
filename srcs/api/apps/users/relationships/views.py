from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiTypes, OpenApiResponse

from .models import Relationship
from .serializers import RelationshipSerializer


class RelationshipViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Relationship.objects.filter(
            Q(user1=self.request.user) | Q(user2=self.request.user)
        )

    @extend_schema(responses=RelationshipSerializer(many=True))
    @action(methods=['get'], detail=False)
    def friends_list(self, request):
        queryset = self.get_queryset().filter(state=Relationship.Status.FRIENDS)
        serializer = RelationshipSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(responses=RelationshipSerializer(many=True))
    @action(methods=['get'], detail=False)
    def block_list(self, request):
        queryset = self.get_queryset().filter(
            user1=request.user,
            state=Relationship.Status.BLOCKED
        )
        serializer = RelationshipSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(responses=RelationshipSerializer(many=True))
    @action(methods=['get'], detail=False)
    def friend_requests(self, request):
        queryset = self.get_queryset().filter(
            user2=request.user,
            state=Relationship.Status.PENDING
        )
        serializer = RelationshipSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(responses=RelationshipSerializer(many=True))
    @action(methods=['get'], detail=False)
    def outgoing_requests(self, request):
        queryset = self.get_queryset().filter(
            user1=request.user,
            state=Relationship.Status.PENDING
        )
        serializer = RelationshipSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[OpenApiParameter(
            name='target_user_id',
            type=OpenApiTypes.INT,
            required=True
        )],
        responses={
            201: OpenApiResponse(description='Request successfully sent.'),
            400: OpenApiResponse(description='Bad request.'),
            404: OpenApiResponse(description='User not found.')
        }
    )
    @action(methods=['post'], detail=False)
    def send_request(self, request):
        target_user_id = request.GET.get('target_user_id')
        if not target_user_id:
            return Response({'details': 'target_user_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = get_user_model().objects.filter(id=target_user_id).first()
        if not user:
            return Response({'details': f'User with id {target_user_id} not found.'}, status=status.HTTP_404_NOT_FOUND)

        if self.get_queryset().filter(
            Q(user1=request.user, user2=user) |
            Q(user1=user, user2=request.user)
        ).exists():
            return Response({'details': 'A relationship already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        Relationship.objects.create(
            user1=request.user,
            user2=user,
            state=Relationship.Status.PENDING
        )
        return Response({'details': f'Request sent to {user.username}.'}, status=status.HTTP_201_CREATED)

    @extend_schema(
        responses={
            200: OpenApiResponse(description='Friend request accepted.'),
            404: OpenApiResponse(description='No valid friend request found.')
        }
    )
    @action(methods=['post'], detail=True)
    def accept_request(self, request, pk=None):
        relationship = self.get_queryset().filter(id=pk, user2=request.user).first()
        if not relationship or relationship.state != Relationship.Status.PENDING:
            return Response({'details': 'No valid friend request found.'}, status=status.HTTP_404_NOT_FOUND)

        relationship.state = Relationship.Status.FRIENDS
        relationship.save()
        return Response({'details': 'Friend request accepted.'}, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: OpenApiResponse(description='User blocked successfully.'),
            400: OpenApiResponse(description='Failed to perform this action.')
        }
    )
    @action(methods=['post'], detail=True)
    def block_user(self, request, pk=None):
        relationship = self.get_queryset().filter(id=pk).first()
        if not relationship or relationship.state == Relationship.Status.BLOCKED:
            return Response({'details': 'Failed to perform this action.'}, status=status.HTTP_400_BAD_REQUEST)

        # Swap users if necessary before blocking
        if relationship.user1 != request.user:
            relationship.user1, relationship.user2 = relationship.user2, relationship.user1
        relationship.state = Relationship.Status.BLOCKED
        relationship.save()

        return Response({'details': f'Successfully blocked the user {relationship.user2.username}.'}, status=status.HTTP_200_OK)

    @extend_schema(
        responses={
            200: OpenApiResponse(description='Relationship removed successfully.'),
            404: OpenApiResponse(description='No relationship found.'),
            400: OpenApiResponse(description='Failed to perform this action.')
        }
    )
    @action(methods=['post'], detail=True)
    def remove_relationship(self, request, pk=None):
        relationship = self.get_queryset().filter(id=pk).first()
        if not relationship:
            return Response({'details': 'No relationship found.'}, status=status.HTTP_404_NOT_FOUND)

        if relationship.state == Relationship.Status.BLOCKED and relationship.user1 != request.user:
            return Response({'details': 'Failed to perform this action.'}, status=status.HTTP_400_BAD_REQUEST)

        relationship.delete()
        return Response({'details': 'Successfully removed the relationship.'}, status=status.HTTP_200_OK)
