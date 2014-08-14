#!/bin/bash
source lib/test_lib.sh

# Bypass router
DJANGO_PORT=3004
DJANGO_URL=http://localhost:${DJANGO_PORT}

URL_ENDPOINTS='''
moviemap/sanfrancisco/index.html
moviemap/api/sanfrancisco/locations
moviemap/api/sanfrancisco/locations?=Bullitt
moviemap/api/sanfrancisco/titles
'''

echo ">Testing webapp and api endpoints..."
for endpoint in ${URL_ENDPOINTS}
  do echo "Testing ${DJANGO_URL}/${endpoint}"
  curl -sI ${DJANGO_URL}/${endpoint} 2>&1 | grep -P "HTTP/.*200 OK" > /dev/null 2>&1 && pass_print "Pass" || error "Fail"
done
