import logstash
from config.envm import env

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'logstash': {
            '()': 'logstash.formatter.LogstashFormatterVersion1',
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'logstash': {
            'level': 'INFO',
            'class': 'logstash.TCPLogstashHandler',
            'host': env('LOGSTASH_HOST', default='logstash'),
            'port': env.int('LOGSTASH_PORT', default=50000),
            'version': 1,
            'message_type': 'django',
            'fqdn': False,
            'tags': ['django'],
            'formatter': 'logstash',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['logstash', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    }
}