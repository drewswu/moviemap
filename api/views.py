from django.shortcuts import render
from django.http import HttpResponse
from json import dumps, loads
from moviemap.settings import MAP_API_SOURCE_URL
from urllib2 import urlopen


def locations(request, city):
  """
  Return locations for either a single movie or all movies
  """
  movies_json = urlopen(MAP_API_SOURCE_URL).read()
  title = request.GET.get('title')
  if title:
    locations = loads(movies_json)
    title_locations = [ location for location in locations if location['title'].lower() == title.lower() ]
    movies_json = dumps(title_locations)
  return HttpResponse(movies_json, content_type="application/json")

def titles(request, city):
  """
  Return all the movie titles
  """

  movies_json = urlopen(MAP_API_SOURCE_URL).read()
  try:
    locations = loads(movies_json)
  except ValueError as e:
    print "Error: Can not decode json: %s\n%s" % (movies_json, e)
  titles_set = set([ location['title'] for location in locations ])  # De-dupe titles
  titles_json = dumps({ 'titles': list(titles_set) })

  return HttpResponse(titles_json, content_type="application/json")
