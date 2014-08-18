var API_TITLES_URL = "http://drewbie.io/moviemap/api/sanfrancisco/titles",
    API_LOCATIONS_URL = "http://drewbie.io/moviemap/api/sanfrancisco/locations?title=",
    markers = [],      // Stores google map markers
    titlesList = [],   // Stores all movie titles
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
  }
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
      ttl: 1,  // slight hack: invalidate cache to save titles
      ajax: {
        async: 'true',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          titlesList = data.titles;
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

/* Deletes map markers, if present */
function deleteMarkers() {
  for (var x = 0; x < markers.length; x++) {
    markers[x].setMap(null);
  }
  markers = [];
}

/* Deletes all rows from the locations table */
function deleteTable() {
  locationTable.find("tr:gt(0)").remove();
  $("#table-div").hide();
}

/* Clears error after a timeout period */
function clearError(id, sec) {
  setTimeout(function(){ $('#' + id).remove();}, sec);
}

/* Display error with optional console logging */
function displayError(id, msg, logging) {
  $('#map-canvas').after(
    '<div id="' + id + '" class="error">' + msg + '</div>'
  );
  if (logging) {
    console.log(msg);
  }
}

/* Add a row to the location-fun facts table */
function addRow(address) {
  var row = locationTable[0].insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  if (address.funFacts) {
    cell2.innerHTML = address.funFacts;
  } else {
    cell2.innerHTML = '-';
  }
  if (address.locations) {
    cell1.innerHTML = address.locations;
  } else {
    cell1.innerHTML = '-';
  }
}

/* Adds map markers for all returned locations. */
function updateMap() {
  input = $('#search').val();
  // Basic input validation
  if (titlesList.indexOf(input) >= 0) {
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
            if (address.locations !== null) {
              var locationString = address.locations;
              geocoder.geocode({
                  'address': address.locations + ', San Francisco, CA',
                  'location': baseLocation,
                  'region': 'us',
                },
                function(results) {
                  if (results !== null) {
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
                    displayError('errorGEO', 'Error: Could not geocode a result from "' + address.locations + '"<br>Logged to console.log', true );
                    clearError('errorGEO', 10000);
                  }
                }
              );
            } else {
              displayError('errorLOC', 'Error: Location with no address returned: "' + JSON.stringify(address) + '"<br>Logged to console.log.', true);
              clearError('errorLOC', 10000);
            }
          })(data[x]);
        NProgress.done();
        $('#table-div').show();  // Display locations table
      }
    }});
  } else {
    displayError('errorIFV', '"' + input + '" is not a valid movie title', false);
    clearError('errorIFV', 5000);
  }
};
