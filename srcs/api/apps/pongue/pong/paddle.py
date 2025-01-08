class Paddle:
    VAL = 10
    WIDTH = 100
    HEIGHT = 20
    
    def __init__(self, x, y):
        self.x = self.original_x = x
        self.y = self.original_y = y
    
    def move(self, right=True):
        from .game import Game
        if (self.x <= 0 and not right) or (self.x + self.WIDTH >= Game.WIDTH and right):
            return
        self.x += self.VAL if right else -self.VAL
    
    def reset(self):
        self.x = self.original_x
        self.y = self.original_y