// Creating map object
var map = L.map("map", {
    center: [17.82, -99.9],
    zoom: 4
  });
  const API_KEY = "pk.eyJ1IjoiY2Fta2lyayIsImEiOiJjanRreWRjOHAwODV3NGFwaDJ0aDhzMmZyIn0.-2ThPrlMkFOzt87qLL5PyA";

  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  }).addTo(map);

  var link = "/jsonfile"

// Grabbing our GeoJSON data..
d3.json(link, function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data).addTo(map);
});