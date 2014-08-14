var api_titles_url = "http://drewbie.io/moviemap/api/sanfrancisco/titles";
var api_locations_url = "http://drewbie.io/moviemap/api/sanfrancisco/locations?title=";
var markers = [];       // Stores google map markers
var titles_list = [];   // Stores all movie titles
var geocoder;           // Google geocode obj
var map;                // Google Map obj
var base_location;      // San Francisco LatLng
var titles_engine;      // Bloodhound engine


/* Google Map init */
function initialize() {
  geocoder = new google.maps.Geocoder();
  base_location = new google.maps.LatLng(37.77493, -122.41942);
  var mapOptions = {
    zoom: 12,
    center: base_location
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

/* Typeahead init */
$(document).ready(function() {
  google.maps.event.addDomListener(window, 'load', initialize);
  titles_engine = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
      url: api_titles_url,
      ttl: 1,  // slight hack: invalidate cache to save titles
      ajax: {
        async: 'true',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          window.titles_list = data.titles;
        }
      },
      filter: function(data) {
        return $.map(data.titles, function(title) {
          return { name: title };
        });
      }
    }
  });
  titles_engine.initialize();
  $('#prefetch .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1,
  },
  {
    name: 'titles',
    displayKey: 'name',
    source: titles_engine.ttAdapter(),
  });
});

/* Deletes map markers, if present */
function deleteMarkers() {
  for (var x = 0; x < markers.length; x++) {
    markers[x].setMap(null);
  }
  markers = [];
}

/* Deletes location table */
function deleteTable() {
  $("#locations-table").find("tr:gt(0)").remove();
  $("#table-div")[0].style.display = 'none';
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

/* Add a row to the fun facts table */
/* TODO: use DOM reference to table instead of costly jQuery lookups! */
function addRow(address) {
  var table = $("#locations-table")[0];
  var row = table.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  if (address.fun_facts) {
    cell2.innerHTML = address.fun_facts;
  } else {
    cell2.innerHTML = '-';
  }
  if (address.locations) {
    cell1.innerHTML = address.locations;
  } else {
    cell1.innerHTML = '-';
  }
}

/* Adds map markers for all locations returned */
function updateMap() {
  input = $("#search").val();
  // Basic input validation
  if (titles_list.indexOf(input) >= 0) {
    // Start progress bar
    NProgress.start();
    NProgress.set(0.2);
    // Retrieve locations from Movie Map API
    $.ajax({
      async: 'false',
      dataType: 'json',
      type: 'GET',
      url: api_locations_url + encodeURIComponent(input),
      success: function(data) {
        // Teardown any previous results
        deleteMarkers();
        deleteTable();
        for (var x = 0; x < data.length; x++) {  // Iterate over locations
          (function(address){
            NProgress.inc();
            addRow(address);
            if (address.locations !== null) {
              var location_string = address.locations;
              geocoder.geocode({
                  'address': address.locations + ', San Francisco, California',
                  'location': base_location,
                  'region': 'us',
                },
                function(results) {
                  if (results !== null) {
                    var marker = new google.maps.Marker({
                      map: window.map,
                      position: results[0].geometry.location,
                      title: input + ' - ' + address.locations,
                    });
                    window.markers.push(marker);
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
        $('#table-div')[0].style.display = 'block';  // Display fun facts table
      }
    }});
  } else {
    displayError('errorIFV', '"' + input + '" is not a valid movie title', false);
    clearError('errorIFV', 5000);
  }
};
