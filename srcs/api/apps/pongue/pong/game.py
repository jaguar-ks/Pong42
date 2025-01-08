from .paddle import Paddle
from .ball import Ball
from .player import Player
import math

class GameInfo:
    def __init__(self, player1, player2, ball):
        self.player1 = player1
        self.player2 = player2
        self.ball = ball
    
    def to_json(self):
        return {
            f'{self.player1.player_id}': {
                # 'id': self.player1.player_id,
                'score': self.player1.score,
                'x': self.player1.x,
                'y': self.player1.y
            },
            f'{self.player2.player_id}': {
                # 'id': self.player2.player_id,
                'score': self.player2.score,
                'x': self.player2.x,
                'y': self.player2.y
            },
            'ball': {
                'x': int(self.ball.x),
                'y': int(self.ball.y)
            },
        }

class Game:
    WIDTH = 600
    HEIGHT = 800

    def __init__(self, player1_id: int, player2_id: int):
        self.player1 = Player(
            (self.WIDTH // 2) - (Paddle.WIDTH // 2),
            self.HEIGHT - Paddle.HEIGHT,
            player1_id
        )
        self.player2 = Player(
            (self.WIDTH // 2) - (Paddle.WIDTH // 2),
            0,
            player2_id
        )
        self.ball = Ball(self.WIDTH // 2, self.HEIGHT // 2)
    
    def hit(self):
        ball = self.ball
        
        player = self.player1 if ball.y > self.HEIGHT / 2 else self.player2
        
        b_top = self.ball.y - self.ball.RADIUS
        b_bot = self.ball.y + self.ball.RADIUS
        b_left = self.ball.x - self.ball.RADIUS
        b_right = self.ball.x + self.ball.RADIUS
        
        pl_top = player.y
        pl_bot = player.y + Paddle.HEIGHT
        pl_left = player.x
        pl_right = player.x + Paddle.WIDTH
        
        if b_left < pl_right and b_right > pl_left and b_top < pl_bot and b_bot > pl_top:
            return player
        return None 
    
    def loop(self):
        self.ball.move()
        player = self.hit()
        if player is not None:
            col = (self.ball.x - (player.x + Paddle.WIDTH / 2)) / (Paddle.WIDTH / 2)
            col = max(-1, min(1, col))
            ang = col * math.radians(45)
            dirc = -1 if player == self.player1 else 1 
            self.ball.val_x = self.ball.speed * math.sin(ang)
            self.ball.val_y = self.ball.speed * math.cos(ang) * dirc
            self.ball.speed = min(self.ball.speed + 0.5, self.ball.MAX_SPEED)
        if self.ball.y + self.ball.RADIUS >= self.HEIGHT:
            self.player2.increase_score()
            self.ball.reset()
        elif self.ball.y - self.ball.RADIUS <= 0:
            self.player1.increase_score()
            self.ball.reset()
        return GameInfo(self.player1, self.player2, self.ball)
        
    def move_paddle(self, player_id, right=True):
        if player_id == self.player1.player_id:
            self.player1.move(right)
        elif player_id == self.player2.player_id:
            self.player2.move(right)
        else:
            raise ValueError("Invalid player id")
        return GameInfo(self.player1, self.player2, self.ball)
    