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
                'x': self.ball.x,
                'y': self.ball.y
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
            Paddle.HEIGHT,
            player2_id
        )
        self.ball = Ball(self.WIDTH // 2, self.HEIGHT // 2)
    
    def hit(self):
        ball = self.ball
        pdl1 = self.player1
        pdl2 = self.player2
        
        if ball.y + ball.RADIUS >= pdl1.y and ball.y - ball.RADIUS <= pdl1.y + Paddle.HEIGHT:
            if ball.x - ball.RADIUS <= pdl1.x + Paddle.WIDTH and ball.x + ball.RADIUS >= pdl1.x:
                return self.player1
        elif ball.y + ball.RADIUS >= pdl2.y and ball.y - ball.RADIUS <= pdl2.y + Paddle.HEIGHT:
            if ball.x - ball.RADIUS <= pdl2.x + Paddle.WIDTH and ball.x + ball.RADIUS >= pdl2.x:
                return self.player2
        return None 
    
    def loop(self):
        self.ball.move()
        player = self.hit()
        if player:
            col = (self.ball.x -(player.x + Paddle.WIDHT // 2)) / (Paddle.WIDTH // 2)
            angl = col * (math.pi / 4)
            dirc = 1 if self.ball.val_y > 0 else -1
            self.ball.val_x = self.ball.MAX_VAL * math.cos(angl)
            self.ball.val_y = self.ball.MAX_VAL * dirc * math.sin(angl)
            self.ball.speed += 0.4
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
    