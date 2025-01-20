from django.urls import path


from . import views

urlpatterns = [
    path(
        route="<int:user_id>/matches",
        view=views.UserGameHistory.as_view(),
        name='user_match_history',
    ),
]

