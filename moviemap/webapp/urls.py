from django.conf.urls import patterns, url
from webapp import views

urlpatterns = patterns('',
                       url(r'^index\.html$', views.index, name='index'),
)
