import random
import math

class Ball:
    MAX_SPEED = 15
    RADIUS = 20
    
    def __init__(self, x, y):
        self.x = self.original_x = x
        self.y = self.original_y = y
        pos = random.choice([1, -1])
        self.val_x = 0
        self.val_y = 5 * pos
        self.speed = 10
    
    def move(self):
        from .game import Game
        if self.y + self.RADIUS > Game.HEIGHT or self.y - self.RADIUS <= 0:
            self.val_y *= -1
        if self.x + self.RADIUS > Game.WIDTH or self.x - self.RADIUS <= 0:
            self.val_x *= -1
        self.x += self.val_x
        self.y += self.val_y
    
    def reset(self):
        self.x = self.original_x
        self.y = self.original_y

        pos = random.choice([1, -1])
        
        self.val_x = 0
        self.val_y *= -1
        self.speed = 10