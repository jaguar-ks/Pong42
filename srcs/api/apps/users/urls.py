from django.urls import path, include
from apps.users import views
from rest_framework.routers import DefaultRouter

# URLs configuration
router = DefaultRouter()
router.register(r"connections", views.ConnectionViewSet, basename="connection")
router.register(r"connections/(?P<connection_id>\d+)/messages", views.MessageViewSet, basename="message")  # Add this line

urlpatterns = [
    path("", views.ListUserView.as_view(), name="list_user"),
    path("<int:id>/", views.UserRetriveView.as_view(), name="user_retrieve"),
    path("leaderboard/", views.LeaderBoardView.as_view(), name="leaderboard_view"),
    path("search/", views.UserSearchView.as_view(), name="user_search"),
    path("me/", views.AuthUserView.as_view(), name="auth_user_view"),
    path("me/", include(router.urls)),
]
