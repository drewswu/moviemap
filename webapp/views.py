#from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from moviemap.settings import CITY_TABLE

def index(request, city):
  context = RequestContext(request)
  context_dict = { 'city': CITY_TABLE[city] }
  return render_to_response('webapp/index.html', context_dict, context)
