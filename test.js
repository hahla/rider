var tj = require('togeojson'),
    fs = require('fs'),
    jsdom = require('jsdom').jsdom

function Place (name, coords) {
    this.name = name;
    this.coords = coords;
};

Place.prototype.lat = function() { return this.coords[0]; }
Place.prototype.lng = function() { return this.coords[1]; }

var kml = jsdom(fs.readFileSync('resources/sfoclassic.kml', 'utf8'))

var converted = tj.kml(kml)

var conv_with_styles = tj.kml(kml, { styles: true })

console.log(JSON.stringify(converted));
var myplaces = new Array();

for (var i=0; i < converted.features.length; i++) {

    var p = converted.features[i];
    var name = p.properties.name;
    var coords = p.geometry.coordinates;
//    savePlace(JSON.stringify(new Place(name, coords)));
    myplaces.push(new Place(name, coords));
    console.log(name, coords) // JSON.stringify(name))
}
console.log(JSON.stringify(myplaces));
savePlace(JSON.stringify(myplaces));

//var fname = "resources/sfoclassic.json"
// body = JSON.stringify(myplace);
function savePlace (body) {
    var fname = "resources/sfoclassic.json"
    fs.appendFile(fname, body, function (err) {
        if (err) {
            console.log("problem saving file: " + err);
            return;
        }
        console.log("save complete");
    });
}

