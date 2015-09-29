var Beverages = require(__dirname + '/../models/beverage');
var express = require('express');
var bodyParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var eatAuth = require(__dirname + '/../lib/eat_auth');

var router = module.exports = exports = express.Router();

router.get("/", function (req, res) {
  res.json({msg:"Enter \/api\/beverages to see beverages"});
});

router.get('/beverages', function (req, res) {
  Beverages.find({}, function (err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});

router.post('/beverages', bodyParser, eatAuth, function (req, res) {
  var newBeverage = new Beverages(req.body);
  newBeverage.user = req.user.username;
  newBeverage.save(function (err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});

router.put('/beverages/:id', bodyParser, eatAuth, function (req, res) {
  var newBeverageBody = req.body;
  delete newBeverageBody._id;
  Beverages.update({_id: req.params.id}, newBeverageBody, function (err, data) {
    if (err) return handleError(err, res);
    res.json({msg:"Success putting data!"});
  });
});

/*
router.get('/beverages/:id', function (req, res) {
  Beverages.findOne({_id: req.params.id}, function (err, data) {
    if (err) return handleError(err, res);
    res.json(data);
  });
});
*/

router.delete('/beverages/:id', bodyParser, eatAuth, function (req, res) {
  Beverages.remove({_id: req.params.id}, function (err) {
    if (err) return handleError(err, res);
    res.json({msg:"Beverage deleted"});
  });
});

