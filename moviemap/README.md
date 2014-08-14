The SF Movie Map project is a webapp and backend API which allows users to search for movies filmed in SF and display these location markers in Google Maps, as well as displaying some fun facts about the location.

#Frameworks/Libraries Used:

Django
jQuery
typeahead.js
nprogress.js
Google Maps Javascript v3

#Data Source

The data source is retrieved from: http://data.sfgov.org/resource/yitu-d5am.json on a per request basis. It is not stored in a database so that updates are immediately present (without additional polling/intake). Caching is not used but should be implemented in order to avoid excessive http requests on the server. While the data source looks to have a long term longevity, were it discontinued there is a backup json dump available for use in /archive.

#Commands

All commands should be run from the project root directory.

To run the webapp and API:
  ./run.sh

To stop the webapp and API:
  ./stop.sh

To deploy new static files:
  ./deploy.sh

To run tests:
  ./test.sh
