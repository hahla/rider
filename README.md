web app to help people share cabs from airports into town

server deps
* node * modules: chai, couchbase, fs-extra, reload, supertest, underscore, colors, express, jsdom, superagent, togeojson

* client/bower_components/
angular                 angular-mocks           bootstrap
angular-animate         angular-route           jquery
angular-bootstrap       angular-ui-map          leaflet-dist
angular-leaflet         angular-ui-utils        leaflet.markerclusterer

you'll need to know how to run couchcbase and init the db with sampledata. there's no fancy stuff there to do that quite yet

to run server
./supervisor --debug server.js

then hit that shit


