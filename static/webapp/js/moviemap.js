var API_TITLES_URL = "http://drewbie.io/moviemap/api/sanfrancisco/titles",
    API_LOCATIONS_URL = "http://drewbie.io/moviemap/api/sanfrancisco/locations?title=",
    markers = [],      // Stores google map markers
    titles = [],       // Stores all movie titles
    geocoder,          // Google geocode obj
    map,               // Google Map obj
    baseLocation,      // San Francisco LatLng
    locationTable;     // Reference to location table jQuery object


/* Google Map init */
function initializeMap() {
  geocoder = new google.maps.Geocoder();
  baseLocation = new google.maps.LatLng(37.77493, -122.41942);  // San Francisco
  var mapOptions = {
    zoom: 12,
    center: baseLocation,
  };
  map = new google.maps.Map($("#map-canvas")[0], mapOptions);
}

$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initializeMap);
  locationTable = $("#locations-table");
  $("#submit")[0].onclick = updateMap;
  /* Typeahead init */
  var titlesEngine = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: API_TITLES_URL,
      ttl: 1,  // slight hack: invalidate cache in order to load titles
      ajax: {
        async: 'true',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          titles = data.titles;
        }
      },
      filter: function(data) {
        return $.map(data.titles, function(title) {
          return { name: title };
        });
      }
    }
  });
  titlesEngine.initialize();
  $('#prefetch .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1,
  },
  {
    name: 'titles',
    displayKey: 'name',
    source: titlesEngine.ttAdapter(),
  });
});

/* Deletes any map markers */
function deleteMarkers() {
  for (var x = 0; x < markers.length; x++) {
    markers[x].setMap(null);
  }
  markers = [];
}

/* Removes all rows from the location table */
function deleteTable() {
  locationTable.find("tr:gt(0)").remove();
  $("#table-div").hide();
}

/* Clears error message after a timeout period */
function clearError(id, sec) {
  setTimeout(function(){ $('#' + id).remove();}, sec);
}

/* Display error message with optional console logging */
function displayError(id, msg, logging) {
  $('#map-canvas').after(
    '<div id="' + id + '" class="error">' + msg + '</div>'
  );
  if (logging) {
    console.log(msg);
  }
}

/* Add a row to the location table */
function addRow(address) {
  var row = locationTable[0].insertRow(1);
  row.insertCell(0).innerHTML = (address.locations ? address.locations : '-');
  row.insertCell(1).innerHTML = (address.fun_facts ? address.fun_facts : '-');
}

/* Adds map markers for all returned locations. */
function updateMap() {
  var input = $('#search').val();
  var lowerCaseTitles = titles.map(function(x) { return x.toLowerCase(); });
  // Basic input validation
  if (lowerCaseTitles.indexOf(input.toLowerCase()) >= 0) {
    // Start progress bar
    NProgress.start();
    NProgress.set(0.2);
    // Retrieve locations from Movie Map API
    $.ajax({
      async: 'false',
      dataType: 'json',
      type: 'GET',
      url: API_LOCATIONS_URL + encodeURIComponent(input),
      success: function(data) {
        // Teardown any previous results
        deleteMarkers();
        deleteTable();
        for (var x = 0; x < data.length; x++) {  // Iterate over locations
          (function(address){
            NProgress.inc();
            addRow(address);
            if (address.locations) {
              var locationString = address.locations;
              geocoder.geocode({
                  'address': address.locations + ', San Francisco, CA',
                  'location': baseLocation,
                  'region': 'us',
                },
                function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    var marker = new google.maps.Marker({
                      map: map,
                      position: results[0].geometry.location,
                      title: input + ' - ' + address.locations,
                    });
                    markers.push(marker);
                    var infowindow = new google.maps.InfoWindow({
                      content: input + ' - ' + address.locations,
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                      infowindow.open(map,marker);
                    });
                  } else {
                    displayError('errorGEO', 'Error: Could not geocode a result for "' + address.locations + '.<br>Status code: ' + status + '"<br>Logged to console.log.', true );
                    clearError('errorGEO', 10000);
                  }
                }
              );
            } else {
              displayError('errorLOC', 'Error: Location has no address: "' + JSON.stringify(address) + '"<br>Logged to console.log.', true);
              clearError('errorLOC', 10000);
            }
          })(data[x]);
          NProgress.done();  // Stop progress bar
          $('#table-div').show();  // Display locations table
        }  // for loop
      }  // success callback
    });  // ajax get
  } else {
    displayError('errorIFV', '"' + input + '" is not a valid movie title', false);
    clearError('errorIFV', 5000);
  }
}
