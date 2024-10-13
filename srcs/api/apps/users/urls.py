from django.urls import path

from .views import AuthUserView, SignUpView, ListUserView

urlpatterns = [
    path('', ListUserView.as_view(), name='list_user'),
    path('me/', AuthUserView.as_view(), name='auth_user_view'),
    path('create/', SignUpView.as_view(), name='sign_up_view'),
]