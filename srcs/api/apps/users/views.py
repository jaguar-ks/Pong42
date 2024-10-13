from rest_framework import generics

from .serializers import AuthUserSerializer, SignUpSerializer
from rest_framework.permissions import IsAuthenticated

class   SignUpView(generics.CreateAPIView):
    serializer_class = [IsAuthenticated]

class   AuthUserView(generics.RetrieveAPIView):
    serializer_class = AuthUserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

# class   UpdateAuthUserView():
#     pass

# class   DeleteAuthUserView():
#     pass
    

"""
/api/users/me
/api/users/{user_id}
"""