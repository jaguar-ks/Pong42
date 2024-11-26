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
        status.HTTP_401_UNAUTHORIZED: UNAUTHORIZE_RESPONSE,
        status.HTTP_400_BAD_REQUEST: OpenApiResponse(
            description='Bad request: Invalid data provided',
            response={
                'type': 'object',
                'properties': {
                    'field_name': {
                        'type': 'array',
                        'items': {
                            'type': 'string',
                            'example': 'Invalid data provided'
                        },
                    },
                },
            }
        )
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


USER_RETRIEVE_SCHEMA = {
    'get': extend_schema(
        summary='get user datails',
        description='get user datails by id',
        responses={
            status.HTTP_200_OK: OpenApiResponse(
                description='User datails',
                response=serializers.UserDetailSerializer
            ),
            status.HTTP_401_UNAUTHORIZED: UNAUTHORIZE_RESPONSE,
            status.HTTP_404_NOT_FOUND: OpenApiResponse(
                description='User not found',
                response={
                    'type': 'object',
                    'properties': {
                        'detail': {
                            'type': 'string',
                            'example': 'User not found'
                        },
                    }
                }
            )
        },
        tags=['USERS']
    )
}


USER_LIST_SCHEMA = {
    'summary': 'get all users',
    'description': 'get all users',
    'responses': {
        # default response
        status.HTTP_200_OK: OpenApiResponse(
            description='List of users',
            response={
                'type': 'array',
                'items': {
                    'type': 'object',
                    'example': serializers.UserSerializer().data,
                }
            }
        ),
        status.HTTP_401_UNAUTHORIZED: UNAUTHORIZE_RESPONSE
    },
    'tags': ['USERS']
}

LEADER_BOARD_SCHEMA = USER_LIST_SCHEMA.copy()
LEADER_BOARD_SCHEMA['summary'] = 'get users leader board'
LEADER_BOARD_SCHEMA['description'] = 'get users leader sorted by rating in descending order'

USER_SEARCH_SCHEMA = {
    **USER_LIST_SCHEMA,
    'summary': 'search users',
    'description': 'search users by [username, email, first name, last name]',
    'parameters': [
        OpenApiParameter(
            name='search',
            type='string',
            location=OpenApiParameter.QUERY,
            description='search users by [username, email, first name, last name]',
        )
    ]
}
