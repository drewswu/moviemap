#!/bin/bash
source lib/test_lib.sh

# Bypass router
DJANGO_PORT=3004
DJANGO_URL=http://localhost:${DJANGO_PORT}

URL_ENDPOINTS='''
moviemap/api/sanfrancisco/locations
moviemap/api/sanfrancisco/locations?=Bullitt
moviemap/api/sanfrancisco/titles
'''

echo ">Testing API for valid json..."
for endpoint in ${URL_ENDPOINTS}
  do echo "Testing ${DJANGO_URL}/${endpoint} json validity"
  curl -s ${DJANGO_URL}/${endpoint} | python -mjson.tool > /dev/null 2>&1 && pass_print "Pass" || error "Fail"
done
