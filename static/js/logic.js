// Store our API endpoint as queryUrl
var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  console.log(earthquakeUrl)

// Perform a GET request to the query URL
d3.json(earthquakeUrl,function(data) {

   console.log(data.features);

    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
    
        layer.bindPopup(`${feature.properties.place}<hr>Magnitute: ${feature.properties.mag}<hr>Depth: ${feature.geometry.coordinates[2]}`);
    }


    function getColor(depth) {

      if(depth>=90){
          return color= '#FF0000'
      }
        
      else if (depth>=70){

          return color='#ff4d00'

      }else if (depth >=50){

          return color='#ff8000'

      }else if (depth>=30){

          return '#ffb300'

      }else if (depth>=10){

          return  color='#fbff00'

      }else if (depth>=-10){
          return color='#bfff00'
        }

      else{
          return color='#40ff00'
      }


        
    }

  



   // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    var earthquakes=L.geoJSON(data.features,{

      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },

      style: function(feature) {
        return {
          "color": "white",
          "fillOpacity": 1,
          "fillColor": getColor(feature.geometry.coordinates[2]),
          "weight": 5,
          "radius": feature.properties.mag*3,
          "opacity": 0.65    
        }
      }

      

    })


        

   


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
   tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap
  };

  var overlayMaps={

  "Earthquakes":earthquakes


  }

  // Create a new map
  var myMap = L.map("map", {
    center: [
    37.09, -95.71
   ],
    zoom: 5,
    layers: [streetmap,earthquakes]
  });

  // Create a layer control containing our baseMaps
  // Be sure to add an overlay Layer containing the earthquake GeoJSON
  L.control.layers(baseMaps,overlayMaps, {
  collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [-10,10,30, 50, 70, 90]
    labels = [];
    
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
              
              
    }
    return div;
    
    
    
    
  };
    
  legend.addTo(myMap);




})




