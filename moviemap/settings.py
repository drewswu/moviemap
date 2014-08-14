"""
Django settings for moviemap project.
"""
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SETTINGS_DIR = os.path.dirname(__file__)
PROJECT_PATH = os.path.join(SETTINGS_DIR, os.pardir)
PROJECT_PATH = os.path.abspath(PROJECT_PATH)#
TEMPLATE_PATH = os.path.join(PROJECT_PATH, 'templates')
STATIC_PATH = os.path.join(PROJECT_PATH,'static/webapp')
STATIC_ROOT = "/var/www/drewbie.io/static/"

TEMPLATE_DIRS =  (
  TEMPLATE_PATH,
)

STATICFILES_DIRS = (
    STATIC_PATH,
)

DEBUG = False

TEMPLATE_DEBUG = False

SECRET_KEY = os.environ['DJANGO_TEMP']

# TODO: Fix node router so 'drewbie.io' can be used
ALLOWED_HOSTS = [ '*' ]

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.staticfiles',
    'api',
    'webapp',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'moviemap.urls'

WSGI_APPLICATION = 'moviemap.wsgi.application'

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

STATIC_URL = '/static/'

MAP_API_SOURCE_URL = 'http://data.sfgov.org/resource/yitu-d5am.json'

CITY_TABLE = { 'sanfrancisco': 'San Francisco',
               'newyork': 'New York',
               'losangeles': 'Los Angeles', }
