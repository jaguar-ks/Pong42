from django.db.models import F, Case, When, Value, FloatField, PositiveSmallIntegerField
from asgiref.sync import sync_to_async
import math

from apps.users.models import User
from apps.pongue.models import GameMatch
from apps.pongue import pong

@sync_to_async
def save_game(game: pong.Game):

    winner, loser = (
        (game.player1, game.player2)
        if (game.player1.score > game.player2.score)
        else (game.player2, game.player1)
    )

    exponent = max(min((loser.rating - winner.rating) / 400, 10), -10)
    expected_winner = 1 / (1 + math.pow(10, exponent))
    expected_loser = 1 - expected_winner

    k_factor = 32 
    winner_elo = round(winner.rating + k_factor * (1 - expected_winner), 2)
    loser_elo = round(loser.rating + k_factor * (0 - expected_loser), 2)

    GameMatch.objects.create(
        player1_id=game.player1.player_id,
        player1score=game.player1.score,
        player2_id=game.player2.player_id,
        player2score=game.player2.score
    )

    User.objects.filter(id__in=[winner.player_id, loser.player_id]).update(
        rating=Case(
            When(id=winner.player_id, then=Value(winner_elo, output_field=FloatField())),
            When(id=loser.player_id, then=Value(loser_elo, output_field=FloatField())),
            default=F("rating"),
        ),
        wins=Case(
            When(id=winner.player_id, then=F("wins") + 1),
            default=F("wins"),
            output_field=PositiveSmallIntegerField(),
        ),
        loses=Case(
            When(id=loser.player_id, then=F("loses") + 1),
            default=F("loses"),
            output_field=PositiveSmallIntegerField(),
        ),
    )

