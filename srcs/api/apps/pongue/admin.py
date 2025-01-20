from django.contrib import admin

from .models import GameMatch


@admin.register(GameMatch)
class GameMatchAdmin(admin.ModelAdmin):
    pass

