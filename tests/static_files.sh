#!/bin/bash
source lib/test_lib.sh

# Static files served by router
NODE_ROUTER_URL=http://drewbie.io
STATIC_FILES='''
static/moviemap.css
static/nprogress.css
static/js/moviemap.js
static/js/jquery-1.11.1.min.js
static/js/nprogress.js
static/js/typeahead.bundle.min.js
'''
IMAGES='''
static/images/sf.jpg
static/images/favicon.png
'''
echo ">Testing retrieval of css and js static files..."
RESULT=Pass
for file in ${STATIC_FILES}
  do echo "Testing ${NODE_ROUTER_URL}/${file}"
  curl -sI ${NODE_ROUTER_URL}/${file} 2>&1 | grep -P 'HTTP/.+200 OK' && pass_print "Pass" || error "Fail"
done
echo ">Testing image retrieval..."
for file in ${IMAGES}
  do echo "Testing ${NODE_ROUTER_URL}/${file}"
  curl -sI ${NODE_ROUTER_URL}/${file} 2>&1 | grep -P 'HTTP/.+200 OK' && pass_print "Pass" || error "Fail"
done
