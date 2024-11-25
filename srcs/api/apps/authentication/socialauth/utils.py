from urllib.parse import urlencode

def fortytwo_authorize_url(config):
    base_url = config['authorize_url']
    params = {
        'client_id': config['client_id'],
        'redirect_uri': config['redirect_uri'],
        'scope': 'public',
        'response_type': 'code'
    }
    return f'{base_url}?{urlencode(params)}'
