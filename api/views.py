from django.shortcuts import render
from django.http import HttpResponse
from json import dumps, loads
from moviemap.settings import MAP_API_SOURCE_URL
import urllib2


def locations(request, city):
  """
  Return locations for either a single movie or all movies
  """
  try:
    movies_json = urllib2.urlopen(MAP_API_SOURCE_URL).read()
  except (urllib2.HTTPError, urllib2.URLError, urllib2.HTTPException) as e:
    print "Error: Could not execute GET request for %s\n%s" % (MAP_API_SOURCE_URL, e)
  title = request.GET.get('title')
  if title:
    try:
      locations = loads(movies_json)
    except ValueError as e:
      print "Error: Can not decode json: %s\n%s" % (movies_json, e)
    title_locations = [ location for location in locations if location['title'].lower() == title.lower() ]
    movies_json = dumps(title_locations)
  return HttpResponse(movies_json, content_type="application/json")

def titles(request, city):
  """
  Return all the movie titles
  """
  try:
    movies_json = urllib2.urlopen(MAP_API_SOURCE_URL).read()
  except (urllib2.HTTPError, urllib2.URLError, urllib2.HTTPException) as e:
    print "Error: Could not execute GET request for %s\n%s" % (MAP_API_SOURCE_URL, e)
  try:
    locations = loads(movies_json)
  except ValueError as e:
    print "Error: Can not decode json: %s\n%s" % (movies_json, e)
  titles_set = set([ location['title'] for location in locations ])  # De-dupe titles
  titles_json = dumps({ 'titles': list(titles_set) })
  return HttpResponse(titles_json, content_type="application/json")
