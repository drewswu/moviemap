from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()
urlpatterns = patterns('',
    url(r'^moviemap/api/(?P<city>\w{2,30})/', include('api.urls')),
    url(r'^moviemap/(?P<city>\w{2,30})/', include('webapp.urls'))
)
