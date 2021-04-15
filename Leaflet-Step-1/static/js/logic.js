// Store our API endpoint inside queryUrl
/*var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";
//  https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02
// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});*/

var URL_obtained = {
    "type": "FeatureCollection", "metadata": { "generated": 1618446829000, "url": "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2015-01-01&endtime=2015-01-02", "title": "USGS Earthquakes", "status": 200, "api": "1.10.3", "count": 368 }, "features": [{ "type": "Feature", "properties": { "mag": 2.51, "place": "15km E of Little Lake, CA", "time": 1420156541830, "updated": 1457757227609, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ci37300904", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ci37300904&format=geojson", "felt": 2, "cdi": 2.2, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 97, "net": "ci", "code": "37300904", "ids": ",ci37300904,", "sources": ",ci,", "types": ",cap,dyfi,general-link,geoserve,nearby-cities,origin,phase-data,scitech-link,", "nst": 33, "dmin": 0.05801, "rms": 0.2, "gap": 39, "magType": "ml", "type": "quarry blast", "title": "M 2.5 Quarry Blast - 15km E of Little Lake, CA" }, "geometry": { "type": "Point", "coordinates": [-117.7431667, 35.9595, -1.203] }, "id": "ci37300904" },
        { "type": "Feature", "properties": { "mag": 0.5, "place": "70km SE of Lakeview, Oregon", "time": 1420156189165, "updated": 1530315702946, "tz": -480, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/nn00475017", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=nn00475017&format=geojson", "felt": null, "cdi": null, "mmi": null, "alert": null, "status": "reviewed", "tsunami": 0, "sig": 4, "net": "nn", "code": "00475017", "ids": ",nn00475017,", "sources": ",nn,", "types": ",cap,geoserve,nearby-cities,origin,phase-data,", "nst": 4, "dmin": 0.163, "rms": 0.2338, "gap": 225.07, "magType": "ml", "type": "earthquake", "title": "M 0.5 - 70km SE of Lakeview, Oregon" }, "geometry": { "type": "Point", "coordinates": [-119.6275, 41.8495, 6.1] }, "id": "nn00475017" },
        {
            "type": "Feature", "properties": {
                "mag": 1.6, "place": "15km ESE of Cohoe, Alaska", "time": 1420155915725, "updated": 1558406803621, "tz": -540, "url": "https://earthquake.usgs.gov/earthquakes/eventpage/ak01521hzuc", "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=ak0151nki9q & format=geojson","felt":null,"cdi":null,"mmi":null,"alert":null,"status":"reviewed","tsunami":0,"sig":8,"net":"ak","code":"0151nki9q","ids":", ak11477119, ak0151nki9q, ","sources":", ak, ak, ","types":", associate, geoserve, nearby- cities, origin, phase- data, tectonic - summary, ","nst":null,"dmin":null,"rms":0.41,"gap":null,"magType":"ml","type":"earthquake","title":"M 0.7 - 57km S of Cantwell, Alaska"},"geometry":{"type":"Point","coordinates":[-149.2316,62.8856,14.4]},"id":"ak0151nki9q"}],"bbox":[-179.863,-56.805,-1.203,178.9948,81.6983,634.66]}

createFeatures(URL_obtained.features)

function createFeatures(earthquakeData) {

    console.log(earthquakeData);
    earthquakeData.forEach((row) => {
        var mag = row.properties.mag
        var place = row.properties.place
        var lat = row.geometry.coordinates[1];
        var long = row.geometry.coordinates[0];
        

        console.log(mag);
        console.log(place);
        console.log(long);
        console.log(lat);

    });



/*        // iterate over object
keys.forEach((key, index) => {
    console.log(`${key}: ${courses[key]}`);
});
*/


    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    /*function onEachFeature(feature, layer) {

        console.log(feature.properties.place);

        //layer.bindPopup("<h3>" + feature.properties.place +
        // "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }*/

   // Create a GeoJSON layer containing the features array on the earthquakeData object
   // Run the onEachFeature function once for each piece of data in the array
   // var earthquakes = L.geoJSON(earthquakeData, {
   //     onEachFeature: onEachFeature
   //});

    // Sending our earthquakes layer to the createMap function
   // createMap(earthquakes);
}