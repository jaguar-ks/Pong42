from drf_spectacular.utils import OpenApiResponse, OpenApiParameter, extend_schema
from rest_framework import status

from . import serializers

UNAUTHORIZE_RESPONSE = OpenApiResponse(
    description='Unauthorized: User is not authenticated',
    response={
        'type': 'object',
        'properties': {
            'detail': {
                'type': 'string',
                'example': 'Authentication credentials were not provided.'
            },
        }
    }
)

PUT_AUTH_USER_VIEW_SCHEMA = extend_schema(
    summary='update authenticated user datails',
    description='update authenticated user datails',
    responses={
        status.HTTP_200_OK: OpenApiResponse(
            description='Authenticated user datails',
            response=serializers.UpdateAuthUserSerializer
        ),
        status.HTTP_401_UNAUTHORIZED: UNAUTHORIZE_RESPONSE
    },
    tags=['AUTH USER']
)

AUTH_USER_VIEW_SCHEMA = {
    'get': extend_schema(
        summary='get authenticated user datails',
        description='get authenticated user datails',
        responses={
            status.HTTP_200_OK: OpenApiResponse(
                description='Authenticated user datails',
                response=serializers.AuthUserSerializer
            ),
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZE_RESPONSE
        },
        tags=['AUTH USER']
    ),
    'put': PUT_AUTH_USER_VIEW_SCHEMA,
    'patch': PUT_AUTH_USER_VIEW_SCHEMA,
    'delete': extend_schema(
        description='delete authenticated user account',
        responses={
            status.HTTP_204_NO_CONTENT: OpenApiResponse(
                description='successfully deleted your account'
            ),
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZE_RESPONSE
        },
        tags=['AUTH USER']
    )
}
