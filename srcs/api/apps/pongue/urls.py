from django.urls import path


from . import views

urlpatterns = [
    path('matches/', views.MatchHistoryView.as_view(), name='matches_history'),
    path('tournaments/', views.TournamentHistoryView.as_view(), name='tournament_history'),
    path('tournaments/<int:tournament_id>', views.TournamentDetailView.as_view(), name='tounament_detail'),
    path('users/<int:user_id>/matches/', views.UserMatchHistoryView.as_view(), name='user_matches_history'),
]

