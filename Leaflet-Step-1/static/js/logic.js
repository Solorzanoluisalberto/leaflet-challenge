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

var URL_obtained = {};
var selectedDate = formatDateLocal(new Date());

// ========== Tectonic plates data ===============================
// Relative paths work better on GitHub Pages than paths beginning with "/"
var URL_json = "static/GeoJSON/plates.json";

d3.json(URL_json).then(function (response1) {
    L.geoJson(response1, param).addTo(layers.Tectonic2);
}).catch(function (error) {
    console.warn("Tectonic plates file was not loaded:", error);
});

var URL_json1 = "static/GeoJSON/boundaries.json";

d3.json(URL_json1).then(function (geoJsonLayer) {
    L.geoJson(geoJsonLayer).addTo(layers.Tectonic);
}).catch(function (error) {
    console.warn("Tectonic boundaries file was not loaded:", error);
});

// Add date picker control and load today's earthquake events by default
addDatePickerControl();
loadEarthquakesForDate(selectedDate);

// =====================================================================================================================
// Date functions
// =====================================================================================================================

function formatDateLocal(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getNextDate(dateString) {
    var parts = dateString.split("-");
    var date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    date.setDate(date.getDate() + 1);

    return formatDateLocal(date);
}

function buildUSGSUrl(dateString) {
    var startDate = dateString;
    var endDate = getNextDate(dateString);

    return `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&orderby=time`;
}

// =====================================================================================================================
// Date picker control
// =====================================================================================================================

function addDatePickerControl() {
    var dateControl = L.control({ position: "bottomleft" });

    dateControl.onAdd = function () {
        var div = L.DomUtil.create("div", "date-control");

        div.innerHTML = `
            <label for="earthquake-date"><b>Earthquake date</b></label><br>
            <input type="date" id="earthquake-date" value="${selectedDate}" max="${selectedDate}">
            <div id="earthquake-status">Loading...</div>
        `;

        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        return div;
    };

    dateControl.addTo(myMap);

    setTimeout(function () {
        var input = document.getElementById("earthquake-date");

        if (input) {
            input.addEventListener("change", function () {
                selectedDate = this.value;
                loadEarthquakesForDate(selectedDate);
            });
        }
    }, 300);
}

function updateStatus(message) {
    var status = document.getElementById("earthquake-status");

    if (status) {
        status.innerHTML = message;
    }
}

// =====================================================================================================================
// Load earthquake data for selected day
// =====================================================================================================================

function loadEarthquakesForDate(dateString) {
    layers.Earthquake.clearLayers();

    updateStatus("Loading...");

    var URL = buildUSGSUrl(dateString);
    console.log(URL);

    d3.json(URL).then(function (response) {
        URL_obtained = response;

        createFeatures(response.features);

        if (response.features.length === 1) {
            updateStatus("1 event");
        } else {
            updateStatus(`${response.features.length} events`);
        }
    }).catch(function (error) {
        console.error("USGS data was not loaded:", error);
        updateStatus("Data not loaded");
    });
}

// =====================================================================================================================
// Create earthquake markers
// =====================================================================================================================

function createFeatures(earthquakeData) {
    earthquakeData.forEach((row) => {
        var mag = Number(row.properties.mag);
        var place = row.properties.place || "Location not available";
        var long = Number(row.geometry.coordinates[0]);
        var lat = Number(row.geometry.coordinates[1]);
        var depth = Number(row.geometry.coordinates[2]);

        // USGS earthquake time is stored in row.properties.time, not geometry.coordinates[3].
        var earthquakeTime = Number(row.properties.time);
        var formattedTime = isNaN(earthquakeTime)
            ? "Time not available"
            : new Date(earthquakeTime).toLocaleString();

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
                <b>Time:</b> ${formattedTime}
            </div>
        `, {
            maxWidth: 220,
            minWidth: 150,
            autoPan: true,
            keepInView: true,
            className: "earthquake-popup"
        }).addTo(layers.Earthquake);
    });
}

// Marker size based on magnitude.
// Smaller than the old circles, so markers block less of the map.
function getMarkerSize(mag) {
    if (isNaN(mag) || mag <= 0) {
        return 12;
    }

    return Math.min(mag * 4 + 10, 32);
}

// Depth color.
// The exact depth is still shown in the popup.
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

console.log(new Date());
