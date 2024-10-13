from django.urls import path

from .views import AuthUserView

urlpatterns = [
    path('me/', AuthUserView.as_view(), name='auth_user_view'),
]