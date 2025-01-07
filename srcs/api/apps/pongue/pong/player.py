from .paddle import Paddle

class Player(Paddle):
    def __init__(self, x, y, player_id):
        super().__init__(x, y)
        self.player_id = player_id
        self.score = 0
    
    def increase_score(self):
        self.score += 1
    
