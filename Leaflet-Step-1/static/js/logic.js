var Earthquakes = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>   <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
});

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

var mbUrl = "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" + API_KEY;

var grayscale = L.tileLayer(mbUrl, {
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mbAttr
});

var satellite = L.tileLayer(mbUrl, {
    id: "mapbox/satellite-v9",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mbAttr
});

var night = L.tileLayer(mbUrl, {
    id: "mapbox/navigation-night-v1",
    tileSize: 512,
    zoomOffset: -1,
    attribution: mbAttr
});

var baseMaps = {
    "Earthquakes": Earthquakes,
    "Gray Scale": grayscale,
    "Satellite": satellite,
    "Night": night
};

var layers = {
    Earthquake: new L.LayerGroup(),
    Tectonic: new L.LayerGroup(),
    Tectonic2: new L.LayerGroup()
};

var myMap = L.map("mapid", {
    center: [34.8710, -79.7554],
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

L.control.layers(baseMaps, overlaysMaps).addTo(myMap);

// ========== Global Variables =================================
var param = {
    color: "yellow",
    className: "TectonicPlates",
    fillOpacity: 0.1
};

var date_end = "";
var date_init = "";
var dates = get_dates("7");
var URL_obtained = {};
var Depth_selected = "7";

// ========== Tectonic plates data ===============================
// Relative paths work better on GitHub Pages than paths beginning with "/"
var URL_json = "static/GeoJSON/plates.json";

d3.json(URL_json).then(function (response1) {
    L.geoJson(response1, param).addTo(layers.Tectonic2);
});

var URL_json1 = "static/GeoJSON/boundaries.json";

d3.json(URL_json1).then(function (geoJsonLayer) {
    console.log(geoJsonLayer);
    L.geoJson(geoJsonLayer).addTo(layers.Tectonic);
});

// ============ Read Earthquakes data ===============================================================================
var URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${dates.date_init}&endtime=${dates.date_end}`;
console.log(URL);

d3.json(URL).then(function (response) {
    URL_obtained = response;
    createFeatures(URL_obtained.features, Depth_selected);
});

legend();

function createFeatures(earthquakeData, Depth_select) {
    var range = getRange(Depth_select);

    earthquakeData.forEach((row) => {
        var mag = Number(row.properties.mag);
        var place = row.properties.place || "Location not available";
        var long = Number(row.geometry.coordinates[0]);
        var lat = Number(row.geometry.coordinates[1]);
        var depth = Number(row.geometry.coordinates[2]);

        var locationParts = place.split(",");
        var stateDistrict = locationParts.length > 1
            ? locationParts[locationParts.length - 1].trim()
            : "Not specified";

        // USGS earthquake time is stored in row.properties.time, not geometry.coordinates[3].
        var earthquakeTime = Number(row.properties.time);
        var formattedTime = isNaN(earthquakeTime)
            ? "Time not available"
            : new Date(earthquakeTime).toLocaleString();

        if (depth > range.lower && depth < range.upper) {
            var color = get_color(depth);
            var markerSize = getMarkerSize(mag);

            // Custom drop marker.
            // Color = depth. Size = magnitude.
            var earthquakeIcon = L.divIcon({
                className: "earthquake-drop-icon",
                html: `
                    <div style="
                        width: ${markerSize}px;
                        height: ${markerSize}px;
                        background: ${color};
                        border: 2px solid black;
                        border-radius: 50% 50% 50% 0;
                        transform: rotate(-45deg);
                        opacity: 0.9;
                        box-shadow: 0 1px 5px rgba(0,0,0,0.55);
                    ">
                        <div style="
                            width: ${Math.max(markerSize * 0.35, 5)}px;
                            height: ${Math.max(markerSize * 0.35, 5)}px;
                            background: rgba(255,255,255,0.85);
                            border-radius: 50%;
                            position: relative;
                            top: ${markerSize * 0.28}px;
                            left: ${markerSize * 0.28}px;
                        "></div>
                    </div>
                `,
                iconSize: [markerSize + 4, markerSize + 4],
                iconAnchor: [(markerSize + 4) / 2, markerSize + 4],
                popupAnchor: [0, -markerSize]
            });

            L.marker([lat, long], {
                icon: earthquakeIcon,
                title: place
            }).bindPopup(`
                <div class="earthquake-popup-content">
                    <b>Magnitude:</b> ${mag} | <b>Depth:</b> ${depth} km<br>
                    <b>Location:</b> ${place}<br>
                    <b>State / District:</b> ${stateDistrict}<br>
                    <b>Time:</b> ${formattedTime}
                </div>
            `, {
                maxWidth: 240,
                minWidth: 160,
                autoPan: true,
                keepInView: true,
                className: "earthquake-popup"
            }).addTo(layers.Earthquake);
        }
    });
}

// Marker size based on magnitude.
// Smaller than the old circles, so markers block less of the map.
function getMarkerSize(mag) {
    if (isNaN(mag) || mag <= 0) {
        return 14;
    }

    return Math.min(mag * 5 + 12, 36);
}

function getRange(Depth_select) {
    let lower = 0;
    let upper = 0;

    switch (Depth_select) {
        case "0":
            lower = -100;
            upper = 10;
            break;
        case "1":
            lower = 10.1;
            upper = 30;
            break;
        case "2":
            lower = 30.1;
            upper = 50;
            break;
        case "3":
            lower = 50.1;
            upper = 70;
            break;
        case "4":
            lower = 70.1;
            upper = 90;
            break;
        case "5":
            lower = 90.1;
            upper = 500;
            break;
        default:
            lower = -200;
            upper = 500;
            break;
    }

    return {
        lower,
        upper
    };
}

function get_color(depth) {
    let color;

    if (depth <= 10) {
        color = "#66cc00";
    } else if (depth > 10 && depth <= 30) {
        color = "#99cc00";
    } else if (depth > 30 && depth <= 50) {
        color = "#cccc00";
    } else if (depth > 50 && depth <= 70) {
        color = "#cc9900";
    } else if (depth > 70 && depth <= 90) {
        color = "#cc6600";
    } else {
        color = "#661a00";
    }

    return color;
}

function addLegendClickListener() {
    d3.selectAll(".legend1")
        .on("click", function () {
            var Select_legend = d3.select(this).attr("value");

            if (Select_legend != Depth_selected) {
                Depth_selected = Select_legend;

                layers.Earthquake.clearLayers();

                console.log(`Clicked depth filter: ${Depth_selected}`);
                createFeatures(URL_obtained.features, Depth_selected);
            }
        });
}

function getColor(d) {
    return d > 1000 ? "#661a00" :
           d > 90   ? "#802000" :
           d > 70   ? "#cc6600" :
           d > 50   ? "#cc9900" :
           d > 30   ? "#cccc00" :
           d > 10   ? "#99cc00" :
           d > -10  ? "#66cc00" :
                      "#66cc00";
}

function legend() {
    var legend1 = L.control({ position: "bottomleft" });

    legend1.onAdd = function () {
        var div = L.DomUtil.create("div", "legends");
        var grades = [-10, 10, 30, 50, 70, 90];

        let dropmenu = `<select name="dates" id="dates" onchange="FunctionDays(this.value)">
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
        </select>`;

        div.innerHTML += '<i style="background:white" align="center"><b>' + dropmenu + '</b></i><br>';
        div.innerHTML += '<i style="background:white" align="center"><b>Depth</b></i><br>';

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '" class="legend1" value="' + i + '"></i>' +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }

        div.innerHTML += '<br><i style="background:blue" class="legend1" value="7"></i><b>All</b>';

        return div;
    };

    legend1.addTo(myMap);

    setTimeout(addLegendClickListener, 500);
}

function get_dates(days) {
    var date = new Date();

    date_end = date.toISOString().split("T")[0];

    date.setDate(date.getDate() - Number(days));
    date_init = date.toISOString().split("T")[0];

    return {
        date_init,
        date_end
    };
}

function FunctionDays(Select_days) {
    console.log(Select_days);

    dates = get_dates(Select_days);

    var URL = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${dates.date_init}&endtime=${dates.date_end}`;
    console.log(URL);

    d3.json(URL).then(function (response) {
        URL_obtained = response;

        layers.Earthquake.clearLayers();

        createFeatures(response.features, Depth_selected);
    });
}

console.log(new Date());
