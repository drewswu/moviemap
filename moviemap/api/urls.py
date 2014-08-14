from api import views
from django.conf.urls import patterns, url

urlpatterns = patterns('',
                       url(r'^locations$', views.locations, name='locations'),
                       url(r'^titles$', views.titles, name='titles'),
)
