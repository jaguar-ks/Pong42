from django.contrib import admin

from .models import GameMatch


@admin.register(GameMatch)
class GameMatchAdmin(admin.ModelAdmin):
    list_display = ('player1', 'player2', 'player1score', 'player2score')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    search_fields = ('player1__username', 'player2__username')
    
    pass

