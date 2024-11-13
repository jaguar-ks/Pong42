import logstash
from pythonjsonlogger import jsonlogger
from config.env import env

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'logstash': {
            '()': 'logstash.formatter.LogstashFormatterVersion1',
        },
        'simple': {
            'format': '[%(asctime)s][%(levelname)s][%(name)s] %(message)s '
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
            # 'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['logstash', 'console'],
            # 'level': 'INFO',
            'propagate': True,
        },
    }
}