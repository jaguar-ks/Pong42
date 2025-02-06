from django.urls import path


from . import views

urlpatterns = [
    path(
        route="<int:user_id>/matches",
        view=views.UserGameHistory.as_view(),
        name="user_match_history",
    ),
    path(
        route="me/matches",
        view=views.AuthUserMatchHistory.as_view(),
        name="user_match_history",
    ),
    path(
        route="me/rating_history",
        view=views.AuthUserRatingHistory.as_view(),
        name="auth_user_rating",
    ),
    path(
        route="<int:user_id>/rating_history",
        view=views.UserRatingHistory.as_view(),
        name="user_rating_history",
    ),
]
