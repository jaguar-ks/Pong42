from django.contrib import admin

from .models import OneTimePass, SocialAuth

@admin.register(OneTimePass)
class   OneTimePassAdmin(admin.ModelAdmin):
    pass


@admin.register(SocialAuth)
class   SocialAuthAdmin(admin.ModelAdmin):
    pass
