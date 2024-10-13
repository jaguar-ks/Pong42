from django.db import models
from django.contrib.auth import get_user_model

class   Relationship(models.Model):
    
    class   Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        FRIENDS = 'friends', 'Friends'
        BLOCKED = 'blocked', 'Blocked'
    
    user1 = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='relation_as_user1')
    user2 = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='relation_as_user2')
    state = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class   Meta:
        unique_together = ['user1', 'user2']
    
    def __str__(self) -> str:
        return f'[{self.user1}:{self.user2}]: {self.state}'
