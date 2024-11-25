from config.env import env

OAUTH_PROVIDERS_SETTINGS = {
    '42': {
        'client_id': env('42_OAUTH_CLIENT_ID'),
        'client_secret': env('42_OAUTH_CLIENT_SECRET'),
        'redirect_uri': env('42_OAUTH_REDIRECT_URI'),
        'token_url': 'https://api.intra.42.fr/oauth/token',
        'authorize_url': 'https://api.intra.42.fr/oauth/authorize',
        'user_info_url': 'https://api.intra.42.fr/v2/me',
        'scope': 'public',
        'user_info_kwargs': [
            ('username', 'login'),
            ('email', 'email'),
            ('first_name', 'first_name'),
            ('last_name', 'last_name'),
            ('avatar_url', 'image.link')
        ]
    },
    'google': {
        'client_id': env('GOOGLE_OAUTH_CLIENT_ID'),
        'client_secret': env('GOOGLE_OAUTH_CLIENT_SECRET'),
        'redirect_uri': env('GOOGLE_OAUTH_REDIRECT_URI'),
        'token_url': 'https://oauth2.googleapis.com/token',
        'authorize_url': 'https://accounts.google.com/o/oauth2/v2/auth',
        'user_info_url': 'https://www.googleapis.com/oauth2/v2/userinfo',
        'scope': [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'openid'
        ],
        'user_info_kwargs': [
            ('email', 'email'),
            ('first_name', 'given_name'),
            ('last_name', 'family_name'),
            ('avatar_url', 'picture')
        ]
    },
    'github': {
        'client_id': env('GITHUB_OAUTH_CLIENT_ID'),
        'client_secret': env('GITHUB_OAUTH_CLIENT_SECRET'),
        'redirect_uri': env('GITHUB_OAUTH_REDIRECT_URI'),
        'token_url': 'https://github.com/login/oauth/access_token',
        'authorize_url': 'https://github.com/login/oauth/authorize',
        'user_info_url': 'https://api.github.com/user',
        'scope': 'user:email',
        'user_info_kwargs': [
            ('username', 'login'),
            ('email', 'email'),
            ('first_name', 'name'),
            ('last_name', 'name'),
            ('avatar_url', 'avatar_url'),
        ]
    }
}
