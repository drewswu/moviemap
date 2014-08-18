The SF Movie Map project allows users to see San Francisco locations that have been used in films. These movie locations will appear in Google Maps along with some fun facts about that location.

The project consists of a web frontend and a backend API. The backend end can support additional frontend types, such as mobile, native apps, or CLI tools.

#Frameworks/Libraries Used:

Django
jQuery
typeahead.js
nprogress.js
Google Maps Javascript v3

#Data Source

The data source is retrieved from http://data.sfgov.org/resource/yitu-d5am.json on a per request basis. It is not stored in a database so that updates are immediately picked up (without requiring polling and intake.) Eventually when the project goes in to production, there will need to be a proper DB and caching layer to remove the external dependency. In the meanwhile, should the data source go down or end itself, there is a backup json dump in /archive which can be used.

#Commands

All commands should be run from the project root directory. The default port is 3004.

To run the webapp and API:
  ./run.sh <PORT>

To stop the webapp and API:
  ./stop.sh <PORT>

To deploy new static files:
  ./deploy.sh

To run tests:
  ./test.sh
