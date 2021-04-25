
// Adding tile layer to the map
if (!('fetch' in window)) {
    console.log('Fetch API not found, try including the polyfill');
  }

var Earthquakes = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> � <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    
});
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale = L.tileLayer(mbUrl, { id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr }),
    satalite = L.tileLayer(mbUrl, { id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr }),
    night = L.tileLayer(mbUrl, { id: 'mapbox/navigation-night-v1', tileSize: 512, zoomOffset: -1, attribution: mbAttr });

/*var ColoredMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});*/

// Define baseMaps Object to Hold Base Layers
var baseMaps = {
    "Earthquakes": Earthquakes,
    "Gray Scale": grayscale,
    "Satalite": satalite,
    "Night": night
};
//var myLayer = L.geoJSON().addTo(myMap);

// Initialize all of the LayerGroups we'll be using
var layers = {
    Earthquake: new L.LayerGroup(),
    Tectonic: new L.LayerGroup(),
    Tectonic2: new L.LayerGroup()
};

// Create the map with our layers
var myMap = L.map("mapid", {
    center: [34.8710, -79.7554], //Coward SC
    zoom: 3,
    layers: [
        layers.Earthquake,
        layers.Tectonic,
        layers.Tectonic2
    ]
});
Earthquakes.addTo(myMap);

var overlaysMaps = {
    "Earthquake": layers.Earthquake,
    "Tectonic Plates": layers.Tectonic,
    "Tectonic Plates I": layers.Tectonic2
};
// Create a control for our layers, add our overlay layers to it
L.control.layers(baseMaps, overlaysMaps).addTo(myMap);
// ========== Global Variables =================================
var latlngs = [];
var param = {
    color: 'yellow',
    className: 'TectonicPlates',
    fillOpacity: .1
};
var date_end = ""
var date_init = ""
var dates = get_dates("7") // last seven days search
var URL_obtained={};
var Depth_selected = "7"; // include All earthquakeData
var geometryPlates = {};
// ========== red tectonic plates data ===============================
//var URL_json = "http://localhost:8000/static/GeoJSON/plates.json";
var URL_json = "/static/GeoJSON/plates.json";
d3.json(URL_json).then(function (response1) {
    //let geoJsonLayerPlates = L.geoJson(response1,{style: styleFunction})
    let geoJsonLayerPlates = L.geoJson(response1,param)

        .addTo(layers.Tectonic2);
    //create_Tectonics_Plates(geometryPlates.features); // call funxtion create Tectonics plates
}); 
function styleFunction(){
    return {color: "purple"};
  }
// ======================= end ====================================
//=================================================================
// var URL_json1 = "/static/GeoJSON/boundaries.json";
var URL_json1 = "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_boundaries.json"
d3.json(URL_json1).then(function (geoJsonLayer) {
    //geoJsonLayer = response1
    console.log(geoJsonLayer)
    //let geoJsonLayer1 = L.geoJson(geoJsonLayer, { style: styleFunction })
    let geoJsonLayer1 = L.geoJson(geoJsonLayer)
        .addTo(layers.Tectonic);
   // create_Tectonics_Plates(geometryPlates.features); // call funxtion create Tectonics plates
}); 

// ============ read Earthqueakes data ===============================================================================
var URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${dates.date_init}&endtime=${dates.date_end}`
console.log(URL)

d3.json(URL).then(function (response) {
    URL_obtained = response;
    // createFeatures(URL_obtained.features, "7"); // initial map
    createFeatures(URL_obtained.features, Depth_selected) // call function create circle earthquake
});
//============================ end ===================================================================================

// var URL_obtained1 = {"type": "FeatureCollection", "metadata": { "generated": 1618446829000, "url": "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=2015-01-02", "title": "USGS Earthquakes", "status": 200, "api": "1.10.3", "count": 368 }, "features": [{ "type": "Feature", "properties": { "mag": 2.51, "place": "15km E of Little Lake, CA", "time": 1420156541830, "updated": 1457757227609, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ci37300904", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37300904&format=geojson", "felt": 2, "cdi": 2.2, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 97, "net": "ci", "code": "37300904", "ids": ",ci37300904,", "sources": ",ci,", "types": ",cap,dyfi,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,", "nst": 33, "dmin": 0.05801, "rms": 0.2, "gap": 39, "magType": "ml", "type": "quarry blast", "title": "M 2.5 Quarry Blast - 15km E of Little Lake, CA" }, "geometry": { "type": "Point", "coordinates": [-117.7431667, 35.9595, -1.203] }, "id": "ci37300904" },
//         { "type": "Feature", "properties": { "mag": 0.5, "place": "70km SE of Lakeview, Oregon", "time": 1420156189165, "updated": 1530315702946, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/nn00475017", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00475017&format=geojson", "felt": null, "cdi": null, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 4, "net": "nn", "code": "00475017", "ids": ",nn00475017,", "sources": ",nn,", "types": ",cap,geoserve,nearby-cities,origin,phase-data,", "nst": 4, "dmin": 0.163, "rms": 0.2338, "gap": 225.07, "magType": "ml", "type": "earthquake", "title": "M 0.5 - 70km SE of Lakeview, Oregon" }, "geometry": { "type": "Point", "coordinates": [-119.6275, 41.8495, 6.1] }, "id": "nn00475017" },
//         {
//             "type": "Feature", "properties": {
//                 "mag": 1.6, "place": "15km ESE of Cohoe, Alaska", "time": 1420155915725, "updated": 1558406803621, "tz": -540, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ak01521hzuc", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak0151nki9q & format=geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"reviewed","tsunami":0,"sig":8,"net":"ak","code":"0151nki9q","ids":", ak11477119, ak0151nki9q, ","sources":", ak, ak, ","types":", associate, geoserve, nearby- cities, origin, phase- data, tectonic - summary, ","nst":null,"dmin":null,"rms":0.41,"gap":null,"magType":"ml","type":"earthquake","title":"M 0.7 - 57km S of Cantwell, Alaska"},"geometry":{"type":"Point","coordinates":[-149.2316,62.8856,14.4]},"id":"ak0151nki9q"}],"bbox":[-179.863,-56.805,-1.203,178.9948,81.6983,634.66]}

//createFeatures(URL_obtained1.features, "7"); // initial map
legend() // initial legend

function createFeatures(earthquakeData, Depth_select) {
    var range = getRange(Depth_select)
    console.log(earthquakeData);
    earthquakeData.forEach((row) => {
        row.properties.mag = +row.properties.mag;
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
            }).bindPopup("<b>Magnitude: </b>" + mag + " <b>Depth:</b> " + depth + "<hr> <b>City: </b>" + place + "").addTo(layers.Earthquake);
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
// on click listsener legend
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

// ===============================================

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
            let dropmenu = `<select name="dates" id="dates" onchange="FunctionDays(this.value)">
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
          </select>`  
        // <i>Leyend</i>
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML += '<i style="background:white" align="center"><b>' + dropmenu + '</i><br>'
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

// ============= get dates range ============
function get_dates(days) {
    var date = new Date();
    date_end = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    date.setDate(date.getDate() - days);
    date_init = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();

    return {
        date_init,
        date_end
    }
}
// function to filter 7 or 14 days before
function FunctionDays(Select_days) {
    // var Select_days = d3.select(this).attr("value");
    console.log(Select_days);
    dates = get_dates(Select_days);
    var URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${dates.date_init}&endtime=${dates.date_end}`
console.log(URL)

d3.json(URL).then(function (response) {
    // URL_obtained = response;
    var deletepopup = d3.selectAll(".Circles")
    deletepopup.remove();
    // createFeatures(URL_obtained.features, "7"); // initial map
    createFeatures(response.features, "7") // call function create circle earthquake
});
}

console.log(new Date())