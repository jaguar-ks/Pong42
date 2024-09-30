from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
    TokenVerifyView
)

from .views import two_factor

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    
    # 2Fa
    path('2fa/enable/', two_factor.Enable2FaView.as_view(), name='enable_2fa'),
    path('2fa/disable/', two_factor.Enable2FaView.as_view(), name='disable_2fa'),
]