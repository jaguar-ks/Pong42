from django.contrib import admin
from django.contrib.auth.models import Group

from .models import User, Connection

admin.site.unregister(Group)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "is_admin", "is_active")
    list_filter = ("is_admin", "is_active")
    readonly_fields = ("password", "otp_secret")

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "avatar_url")}),
        ("Game Stats", {"fields": ("wins", "loses", "rating", "rank")}),
        ("Permissions", {"fields": ("is_admin", "is_active", "is_email_verified")}),
        (
            "Two Factor Authentication",
            {
                "fields": (
                    "two_fa_enabled",
                    "otp_secret",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )

    search_fields = ("username", "email")
    ordering = ("username",)
    filter_horizontal = ()


@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ("initiator", "recipient", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("initiator__username", "recipient__username")
    raw_id_fields = ("initiator", "recipient")
