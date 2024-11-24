
JAZZMIN_SETTINGS = {
    "site_title": "Transcendance Admin Panel",
    "site_header": "Transcendance Admin",
    "site_brand": "Transcendance",
    "site_logo_classes": "img-fluid",
    "welcome_sign": "Welcome to Transcendance Admin Panel",
    "copyright": "Transcendance © 2024",
    "search_model": ["users.User"],
    "user_avatar": "User.avatar_url",

    "topmenu_links": [
        {"name": "Dashboard", "url": "admin:index", "permissions": ["auth.view_user"]},
        # {"name": "Game Rules", "url": "/game-rules", "new_window": True},  # Example link
        # {"model": "auth.User"},
        # {"app": "transcendance"},
    ],

    "usermenu_links": [
        # {"name": "Help Center", "url": "/help-center", "new_window": True},
        {"model": "users.User"},
    ],

    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": ["token_blacklist"],  # Example to hide unnecessary apps
    "hide_models": [],
    "order_with_respect_to": ["auth", "transcendance"],


    "icons": {
        "auth": "fas fa-lock",
        "auth.user": "fas fa-user-circle",
        "auth.Group": "fas fa-users",
        "transcendance.Match": "fas fa-trophy",
    },
    "default_icon_parents": "fas fa-folder",
    "default_icon_children": "fas fa-file",

    "related_modal_active": True,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,

    "changeform_format": "horizontal_tabs",
    "changeform_format_overrides": {
        "auth.user": "collapsible",
        "transcendance.profile": "vertical_tabs",
    },
    "show_ui_builder": True,
}
