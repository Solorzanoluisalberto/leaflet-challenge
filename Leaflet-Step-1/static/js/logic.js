// Adding tile layer to the map
// Create the tile layer that will be the background of our map
var EarthquakeLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using

// Create the map with our layers
var myMap = L.map("mapid", {
    center: [39.113014, -105.358887],
    zoom: 3
});

EarthquakeLayer.addTo(myMap);

console.log("haz algo")

var URL_obtained = {
    "type": "FeatureCollection", "metadata": { "generated": 1618446829000, "url": "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=2015-01-02", "title": "USGS Earthquakes", "status": 200, "api": "1.10.3", "count": 368 }, "features": [{ "type": "Feature", "properties": { "mag": 2.51, "place": "15km E of Little Lake, CA", "time": 1420156541830, "updated": 1457757227609, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ci37300904", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37300904&format=geojson", "felt": 2, "cdi": 2.2, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 97, "net": "ci", "code": "37300904", "ids": ",ci37300904,", "sources": ",ci,", "types": ",cap,dyfi,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,", "nst": 33, "dmin": 0.05801, "rms": 0.2, "gap": 39, "magType": "ml", "type": "quarry blast", "title": "M 2.5 Quarry Blast - 15km E of Little Lake, CA" }, "geometry": { "type": "Point", "coordinates": [-117.7431667, 35.9595, -1.203] }, "id": "ci37300904" },
    { "type": "Feature", "properties": { "mag": 0.5, "place": "70km SE of Lakeview, Oregon", "time": 1420156189165, "updated": 1530315702946, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/nn00475017", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00475017&format=geojson", "felt": null, "cdi": null, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 4, "net": "nn", "code": "00475017", "ids": ",nn00475017,", "sources": ",nn,", "types": ",cap,geoserve,nearby-cities,origin,phase-data,", "nst": 4, "dmin": 0.163, "rms": 0.2338, "gap": 225.07, "magType": "ml", "type": "earthquake", "title": "M 0.5 - 70km SE of Lakeview, Oregon" }, "geometry": { "type": "Point", "coordinates": [-119.6275, 41.8495, 6.1] }, "id": "nn00475017" },
    {
        "type": "Feature", "properties": {
            "mag": 1.6, "place": "15km ESE of Cohoe, Alaska", "time": 1420155915725, "updated": 1558406803621, "tz": -540, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ak01521hzuc", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak0151nki9q & format=geojson", "felt": null, "cdi": null, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 8, "net": "ak", "code": "0151nki9q", "ids": ", ak11477119, ak0151nki9q, ", "sources": ", ak, ak, ", "types": ", associate, geoserve, nearby- cities, origin, phase- data, tectonic - summary, ", "nst": null, "dmin": null, "rms": 0.41, "gap": null, "magType": "ml", "type": "earthquake", "title": "M 0.7 - 57km S of Cantwell, Alaska"
        }, "geometry": { "type": "Point", "coordinates": [-149.2316, 62.8856, 14.4] }, "id": "ak0151nki9q"
    }], "bbox": [-179.863, -56.805, -1.203, 178.9948, 81.6983, 634.66]
}

createFeatures(URL_obtained.features);

function createFeatures(earthquakeData) {

    console.log(earthquakeData);
    earthquakeData.forEach((row) => {
        var mag = row.properties.mag
        var place = row.properties.place
        var lat = row.geometry.coordinates[1];
        var long = row.geometry.coordinates[0];
        var depth = row.geometry.coordinates[2];
        console.log(mag);
        console.log(place);
        console.log(long);
        console.log(lat);
        var color = get_color(depth);
        if (depth > range.lower && depth < range.upper) {
            var color = get_color(depth); //circle color
            //console.log("Luis cumple");
            L.circle([lat, long], {
                fillOpacity: 0.75,
                color: color,
                fillColor: color,
                // Adjust radius
                radius: lat * 1200
            }).bindPopup("<h2>Magnitude: " + mag + " depth: " + depth + " </h2> <hr> <h3>City: " + place + "</h3>").addTo(myMap);
        }
    });
}

// case depth for color circle in map ===================
function get_color(depth) {
    if (depth <= 10) {
        console.log("depth lest than ten");
        color = "#66cc00";
    } else if (depth > 10 && depth <= 30) {
        //console.log("between 10-30")
        color = "#99cc00";
    } else if (depth > 30 && depth <= 50) {
        console.log("between 30-50")
        color = "#cccc00";
    } else if (depth > 50 && depth <= 70) {
        console.log("between 50-70")
        color = "#cc9900";
    } else if (depth > 70 && depth <= 90) {
        console.log("between 50-70")
        color = "#cc6600";
    } else {
        console.log("depth > 90")
        color = "#661a00"
    }
    return color
}

// range of depth for legend
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

console.log(new Date());
console.log("3");