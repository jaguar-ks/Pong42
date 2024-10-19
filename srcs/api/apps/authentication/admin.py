from django.contrib import admin

from .models import SocialAuth

@admin.register(SocialAuth)
class   SocialAuthAdmin(admin.ModelAdmin):
    pass
