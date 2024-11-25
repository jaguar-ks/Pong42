from django.urls import path

from . import views
from .socialauth.views import SocialAuthView

urlpatterns = [
    # 2Fa
    path('2fa/enable/', views.Enable2FaView.as_view(), name='enable_2fa'),
    path('2fa/disable/', views.Disable2FaView.as_view(), name='disable_2fa'),

    path('sign-up/', views.SignUpView.as_view(), name='sign_up'),
    path('sign-in/', views.SignInView.as_view(), name='sign_in'),
    path('sign-out/', views.SignOutView.as_view(), name='sign_out'),
    path('test_auth/', views.TestAuthView.as_view(), name='test_auth_view'),

    path('email/verify/<str:uid>/<str:token>/', views.EmailVerifyView.as_view(), name='verify_email'),
    path('email/sign-in/<str:uid>/<str:token>/', views.EmailSignInView.as_view(), name='email_sign_in' ),
    path('email/send_email/', views.SendEmailView.as_view(), name='send_email'),

    path('social/<str:provider>/callback/', SocialAuthView.as_view(), name='social_auth_callback')
]
