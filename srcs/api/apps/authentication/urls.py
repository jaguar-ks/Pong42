from django.urls import path

from . import views

urlpatterns = [
    # 2Fa
    path('2fa/enable/', views.Enable2FaView.as_view(), name='enable_2fa'),
    path('2fa/disable/', views.Disable2FaView.as_view(), name='disable_2fa'),

    path('sign-up/', views.SignUpView.as_view(), name='sign_up'),
    path('sign-in/', views.SignInView.as_view(), name='sign_in'),
    path('sign-out/', views.SignOutView.as_view(), name='sign_out'),
]