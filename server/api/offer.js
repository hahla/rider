(function() {
  var _db=undefined;
  var lastId = 10;
  function getNextId() {
    return lastId++;
  }
  exports.db = function(db) { _db = db;}
  exports.list = function(req, res) { 
    doList(_db, function(results) {
      res.json(results);
    });
  };

  exports.create = function  (req, res) {
    console.log("GOT CREATE REQUEST: ", req.body, req.params);
    var newOffer = req.body
    newOffer.id = getNextId();
    doSave(_db, newOffer, function(err) {
      if (err) 
        res.json(formatRespData(0, err))
      else
        res.json(formatRespData({id: newOffer.id}))
    })
  }
  // total fake out. TODO needs to be in sync with the list api.
  exports.total = function (req, res) {
    res.json({total: 10});
  };

})();

// query the db view for all offers. just a test to get the framework in place
function doList(db, cb) {
  var q = db.view("dev_offers", "all_offers", {
    // can pass query params to view here for key filtering, start/end, stale, etc
  });
  q.query(function(err, results) {
    cb(results);
    results.length;
  });
}
// save the object to the db. using a fake docId for now to test the api
function doSave(db, obj, cb) {
  db.set("100", obj, function(results) {
    cb(results);
  });
}

return;
var fs = require('fs-extra'),
    path = require('path'),
    _ = require('underscore');

module.exports = function(opts) {
  return {
    "list": function(req, res) { res.json(DATA);}
  }
}
// module.exports.list = list;
// module.exports.create = create;
// module.exports.read = read;
// module.exports.update = update;
// module.exports.del = del;
// module.exports.total = total;
// module.exports.calltest = calltest;
function Offers() {
  list: list;
}
//module.exports = Offers;
var bucket = undefined;
// module.exports.setbucket = function(b) { 
//   console.log("setting bucket", bucket); 
//   bucket = b; }

var DATA_FILE = './resources/offers.json'
var DATA = fs.readJsonSync(DATA_FILE) //happens at server startup
/**********************
 * Public Interface
 **********************/
function list (req, res) {
  var offset = ~~req.query.offset || 0
    , limit = ~~req.query.limit || 25
  calltest();
  console.log("GOT LIST REQUEST: ", req.body, req.params);
  res.json(DATA); //.slice(offset*limit, offset*limit + limit))
}

function create (req, res) {
  console.log("GOT CREATE REQUEST: ", req.body, req.params);
  var newOffer = req.body
  newOffer.id = getLastId() + 1
  DATA.push(newOffer);
  console.log("in create", req.body);
  saveDB(function(err) {
    if (err) 
      res.json(formatRespData(0, err))
    else
      res.json(formatRespData({id: newOffer.id}))
  })
}

function read (req, res) {
  console.log("GOT READ REQUEST: ", req.body, req.params);
  var id = ~~req.params.id;
  var offer = _(DATA).find(function(offer) { return offer.id === id })

  if (!offer)
    res.json(formatRespData(0, "Can't find offer with id: " + id))
  else
    res.json(formatRespData(offer))
}

function update (req, res) {
  console.log("GOT UPDATE REQUEST: ", req.body, req.params);
  var id = ~~req.params.id
  var offer = _(DATA).find(function(offer) { return offer.id === id })
  var newOfferData = req.body
  offer = _(offer).extend(newOfferData)
  saveDB(function(err) {
    if (err) 
      res.json(formatRespData(0, err))
    else
      res.json(formatRespData({}))
  })
}

function del (req, res) {
  console.log("GOT DEL REQUEST: ", req.body, req.params);
  var id = ~~req.params.id
  var offer = _(DATA).find(function(offer) { return offer.id === id })
  var idx = DATA.indexOf(offer)
  if (idx < 0) return res.json(formatRespData(0, "Could not find offer w/id: " + id))
  DATA.splice(idx, 1)
  saveDB(function(err) {
    if (err) 
      res.json(formatRespData(0, err))
    else
      res.json(formatRespData({}))
  })
}

function total (req, res) {
  console.log("GOT TOTAL REQUEST: ", req.body, req.params);
  total = DATA.length ? DATA.length : 0;
  console.log("total="+total);
  res.json({total: total})
}

/*******************
 * Private Methods
 *******************/
function getLastId () { return DATA.length; }

function formatRespData (code, content) {
  if (typeof code === 'object') {
    content = code,
    code = 1 //0 failure, 1 = success
  }
  return {
    code: code,
    content: content
  }
}

function saveDB (callback) {
  fs.writeJson(DATA_FILE, DATA, callback)
}

