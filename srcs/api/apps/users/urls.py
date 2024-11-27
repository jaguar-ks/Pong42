from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.users import views

router = DefaultRouter()

# URLs configuration
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"connections", views.ConnectionViewSet, basename="connection")


urlpatterns = [
    path("", views.ListUserView.as_view(), name="list_user"),
    path("<int:id>/", views.UserRetriveView.as_view(), name="user_retrieve"),
    path("leaderboard/", views.LeaderBoardView.as_view(), name="leaderboard_view"),
    path("search/", views.UserSearchView.as_view(), name="user_search"),
    path("me/", views.AuthUserView.as_view(), name="auth_user_view"),
    path("me/", include(router.urls)),
]
