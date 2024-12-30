from django.urls import path


from . import views

urlpatterns = [
    path('matches/', views.MatchHistoryView.as_view(), name='matches_history'),
    path('tournaments/', views.TournamentHistoryView.as_view(), name='tournament_history'),
]

