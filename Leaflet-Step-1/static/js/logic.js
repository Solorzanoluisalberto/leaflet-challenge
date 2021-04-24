﻿d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
      this.parentNode.appendChild(this);
    });
  };
// Adding tile layer to the map
var Earthquakes = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> � <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    
});
/*
// Create a map object
var myMap = L.map("mapid", {
    center: [39.113014, -105.358887],
    zoom: 3
});*/
// Initialize all of the LayerGroups we'll be using
var layers = {
    Earthquake: new L.LayerGroup(),
    Tectonic: new L.LayerGroup()
};

// Create the map with our layers
var myMap = L.map("mapid", {
    center: [39.113014, -105.358887],
    zoom: 3,
    layers: [
        layers.Earthquake,
        layers.Tectonic
    ]
});
Earthquakes.addTo(myMap);

var overlaysMaps = {
    "Earthquake": layers.Earthquake,
    "Tectonic": layers.Tectonic
};
// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlaysMaps).addTo(myMap);


// Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
// info.onAdd = function () {
//     var div = L.DomUtil.create("div", "maplegend");
//     return div;
// };
// Add the info legend to the map
//info.addTo(myMap);

console.log("añadi layer");
var latlngs = [
    [33.753746, -84.386330],
    [40.745255, -74.034775],
    [42.933334, -76.566666]
]
var param = {
    color: 'yellow',
    className: 'polygons',
    fillOpacity: .3
};
var polygon = L.polygon(latlngs, param).addTo(layers.Tectonic);
// read architectural plates data
/*d3.json("../GeoJSON/plates.json").then(function (response) {
    plates_obtained = response;
    console.log("placas");*/
// ========== Global Variables ==========================
    var date_end = ""
    var date_init = ""
    var dates = get_dates()
    var URL_obtained={};
    var Depth_selected = "7"; // include All earthquakeData
    var geometryPlates = {};

// ========== red tectonic plates data ===============================
//var URL_json = "http://localhost:8000/static/GeoJSON/plates.json";
var URL_json = "/static/GeoJSON/plates.json";
d3.json(URL_json).then(function (response1) {
    geometryPlates = response1;
    console.log(geometryPlates.features);
    create_Tectonics_Plates(geometryPlates.features); // call funxtion create Tectonics plates
}); 

// geometry.forEach((latlngs1) => {
// console.log(latlngs1.geometry.coordinates);
// var polygons = L.polygon(latlngs.geometry.coordinates);
// polygons.addTo(layers.Tectonic);

function create_Tectonics_Plates(Plates) {
    let latlngs = Row.geometry.coordinates
    console.log(Plates)
    Plates.forEach((Row)=>{
console.log(Row.geometry.coordinates)

    });
}
    
    // ======================= end =========================================
// ============ read Earthqueakes data ===============================================================================
var URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${dates.date_init}&endtime=${dates.date_end}`
console.log(URL)

d3.json(URL).then(function (response) {
    URL_obtained = response;
    // createFeatures(URL_obtained.features, "7"); // initial map

    createFeatures(URL_obtained.features, Depth_selected) // call function create circle earthquake
     //legend() // initial legend
    //any other functions that depend on data
});
//============================ end ===================================================================================

    //var json = require('./data.json'); //(with path)
    
    //createFeatures(URL_obtained.features, Depth_selected)
    //legend() // initial legend
    //any other functions that depend on data
//});

// Initialize an object containing icons for each layer group
/*var icons = {
    Earthquake: L.ExtraMarkers.icon({
        icon: "ion-settings",
        iconColor: "white",
        markerColor: "yellow",
        shape: "star"
    }),
    Tectonic: L.ExtraMarkers.icon({
        icon: "ion-android-bicycle",
        iconColor: "white",
        markerColor: "red",
        shape: "circle"
    })
};*/
// var URL_obtained1 = {"type": "FeatureCollection", "metadata": { "generated": 1618446829000, "url": "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=2015-01-02", "title": "USGS Earthquakes", "status": 200, "api": "1.10.3", "count": 368 }, "features": [{ "type": "Feature", "properties": { "mag": 2.51, "place": "15km E of Little Lake, CA", "time": 1420156541830, "updated": 1457757227609, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ci37300904", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37300904&format=geojson", "felt": 2, "cdi": 2.2, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 97, "net": "ci", "code": "37300904", "ids": ",ci37300904,", "sources": ",ci,", "types": ",cap,dyfi,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,", "nst": 33, "dmin": 0.05801, "rms": 0.2, "gap": 39, "magType": "ml", "type": "quarry blast", "title": "M 2.5 Quarry Blast - 15km E of Little Lake, CA" }, "geometry": { "type": "Point", "coordinates": [-117.7431667, 35.9595, -1.203] }, "id": "ci37300904" },
//         { "type": "Feature", "properties": { "mag": 0.5, "place": "70km SE of Lakeview, Oregon", "time": 1420156189165, "updated": 1530315702946, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/nn00475017", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00475017&format=geojson", "felt": null, "cdi": null, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 4, "net": "nn", "code": "00475017", "ids": ",nn00475017,", "sources": ",nn,", "types": ",cap,geoserve,nearby-cities,origin,phase-data,", "nst": 4, "dmin": 0.163, "rms": 0.2338, "gap": 225.07, "magType": "ml", "type": "earthquake", "title": "M 0.5 - 70km SE of Lakeview, Oregon" }, "geometry": { "type": "Point", "coordinates": [-119.6275, 41.8495, 6.1] }, "id": "nn00475017" },
//         {
//             "type": "Feature", "properties": {
//                 "mag": 1.6, "place": "15km ESE of Cohoe, Alaska", "time": 1420155915725, "updated": 1558406803621, "tz": -540, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ak01521hzuc", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak0151nki9q & format=geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"reviewed","tsunami":0,"sig":8,"net":"ak","code":"0151nki9q","ids":", ak11477119, ak0151nki9q, ","sources":", ak, ak, ","types":", associate, geoserve, nearby- cities, origin, phase- data, tectonic - summary, ","nst":null,"dmin":null,"rms":0.41,"gap":null,"magType":"ml","type":"earthquake","title":"M 0.7 - 57km S of Cantwell, Alaska"},"geometry":{"type":"Point","coordinates":[-149.2316,62.8856,14.4]},"id":"ak0151nki9q"}],"bbox":[-179.863,-56.805,-1.203,178.9948,81.6983,634.66]}

//createFeatures(URL_obtained1.features, "7"); // initial map
legend() // initial legend
//console.log(URL_obtained.features);

function createFeatures(earthquakeData, Depth_select) {
    var range = getRange(Depth_select)

    earthquakeData.forEach((row) => {
        row.properties.mag = +row.properties.mag;
        row.properties.place = +row.properties.place;
        row.geometry.coordinates[0] = +row.geometry.coordinates[0]
        row.geometry.coordinates[1] = +row.geometry.coordinates[1]
        row.geometry.coordinates[2] = +row.geometry.coordinates[2]
        var mag = row.properties.mag
        var place = row.properties.place
        var lat = row.geometry.coordinates[1];
        var long = row.geometry.coordinates[0];
        var depth = row.geometry.coordinates[2];

        if (depth > range.lower && depth < range.upper) {
            var color = get_color(depth); //circle color
            //console.log("Luis cumple");
            L.circle([lat, long], {
                fillOpacity: 0.75,
                color: color,
                fillColor: color,
                className:"Circles",
                // Adjust radius
                radius: lat * 1200
            }).bindPopup("<h2>Magnitude: " + mag + " depth: " + depth + " </h2> <hr> <h3>City: " + place + "</h3>").addTo(layers.Earthquake);
        }
    });
}
function getRange(Depth_select) {
    let lower = 0;
    let upper = 0;
    switch (Depth_select) {
        case "0":
            console.log("pintar < 10")
            //  console.log(bigNumbers)
            lower = -100;
            upper = 10
            break;
        case "1":
            lower = 10.1;
            upper = 30
            console.log("pintar entre 10 y 30")
            console.log(Depth_select)
            break;
        case "2":
            lower = 30.1;
            upper = 50
            break;
        case "3":
            lower = 50.1;
            upper = 70
            console.log("pintar entre 50 y 70")
            console.log(Depth_select)
            break;
        case "4":
            lower = 70.1;
            upper = 90
            console.log("pintar entre 70 y 90")
            console.log(Depth_select)
            break;
        case "5":
            lower = 90.1;
            upper = 500
            console.log("pintar > 90")
            console.log(Depth_select)
            break;
        default:
            console.log("pintar todos")
            lower = -100;
            upper = 500
            break;
    }
    console.log(`${lower} and ${upper}`)
    return {
        lower,
        upper
    };
}
// ===============================================

// case depth for color circle in map ===================
function get_color(depth) {
    if (depth <= 10) {
        // console.log("depth lest than ten");
        color = "#66cc00";
    } else if (depth > 10 && depth <= 30) {
        //console.log("between 10-30")
        color = "#99cc00";
    } else if (depth > 30 && depth <= 50) {
        // console.log("between 30-50")
        color = "#cccc00";
    } else if (depth > 50 && depth <= 70) {
        // console.log("between 50-70")
        color = "#cc9900";
    } else if (depth > 70 && depth <= 90) {
        // console.log("between 50-70")
        color = "#cc6600";
    } else {
        // console.log("depth > 90")
        color = "#661a00"
    }
    return color
}

// ===============================================
    // event listsener to call function change circle in map 

// ===============================================

// function getColor(d) {
//     return d > 1000 ? '#800026' :
//            d > 500  ? '#BD0026' :
//            d > 200  ? '#E31A1C' :
//            d > 100  ? '#FC4E2A' :
//            d > 50   ? '#FD8D3C' :
//            d > 20   ? '#FEB24C' :
//            d > 10   ? '#FED976' :
//                       '#FFEDA0';
// }

function getColor(d) {
    return d > 1000 ? '#661a00' :
            d > 90  ? '#802000' :
            d > 70  ? '#cc6600' :
            d > 50  ? '#cc9900' :
            d > 30  ? '#cccc00' :
            d > 10  ? '#99cc00' :
            d > -10 ? '#66cc00' : 
                      '#66cc00';
}
function legend() {
    var legend1 = L.control({ position: 'bottomleft' });
    legend1.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'legends'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // <i>Leyend</i>
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML += '<i style="background:white" align="center"><b>Depth</b></i><br>'
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '" class="legend1" value=' + i + '></i>' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        div.innerHTML += '<br><i style="background:blue" class="legend1" value="7"></i><b>All</>'
        return div;
    };
    legend1.addTo(myMap);
}
        // iterate over object
// keys.forEach((key, index) => {
//     console.log(`${key}: ${courses[key]}`);
// });
    
function get_dates() {
    var date = new Date();
    date_end = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    date.setDate(date.getDate() - 2);
    date_init = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    return {
        date_init,
        date_end
    }
}

/*var queryUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${date_init}&endtime=${date_end}`;
console.log(queryUrl)
*/// ====================================================
// on click litsener legend
d3.selectAll(".legend1")
    .on("click", function () {
        var Select_legend = d3.select(this).attr("value");
        // console.log(Select_legend);
        if (Select_legend != Depth_selected) {
            Depth_selected = Select_legend
            var deletepopup = d3.selectAll(".Circles")
            deletepopup.remove();
            console.log(`hizo clic: ${Depth_selected}`) ;
            createFeatures(URL_obtained.features, Depth_selected)
        } else {
            console.log("no hago nada")
        }     
    });
console.log("4");
console.log(new Date())