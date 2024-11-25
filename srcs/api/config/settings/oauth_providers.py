from config.env import env

OAUTH_PROVIDERS_SETTINGS = {
    '42': {
        'client_id': env('42_OAUTH_CLIENT_ID'),
        'client_secret': env('42_OAUTH_CLIENT_SECRET'),
        'redirect_uri': env('42_OAUTH_REDIRECT_URI'),
        'token_url': 'https://api.intra.42.fr/oauth/token',
        'authorize_url': 'https://api.intra.42.fr/oauth/authorize',
        'user_info_url': 'https://api.intra.42.fr/v2/me',
    },
}
