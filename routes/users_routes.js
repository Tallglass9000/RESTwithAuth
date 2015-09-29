var express = require('express');
var User = require(__dirname + '/../models/user');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_error');
var httpBasic = require(__dirname + '/../lib/http_basic');
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();

var usersRouter = module.exports = exports = express.Router();

usersRouter.post('/signup', jsonParser, function (req, res) {
  var newUser = new User();
  newUser.basic.username = req.body.username;
  newUser.username = req.body.username;
  ee.emit('firstAction', req, res, newUser);
});

ee.on('firstAction', function (req, res, newUser) {
  newUser.generateHash(req.body.password, function (err, hash) {
    if (err) return handleError(err, res);
    ee.emit('secondAction', req, res, newUser);
  });
});

ee.on('secondAction', function (req, res, newUser) {
  newUser.save(function (err, data) {
    if (err) return handleError(err, res);
    newUser.generateToken(function(err, token) {
      if (err) return handleError(err, res);
      res.json({token: token});
    });
  });
});

usersRouter.get('/signin', httpBasic, function (req, res) {
  User.findOne({'basic.username': req.auth.username}, function (err, user) {
    if (err) return handleError(err, res);
    if (!user) {
      console.log('could not authenticat: ' + req.auth.username);
      return res.status(401).json({msg: 'could not authenticat'});
      ee.emit('compareHash', req, res, user);
    }
  });
});

ee.on('compareHash', function (req, res, user) {
  user.compareHash(req.auth.password, function (err, hashRes) {
    if (err) return handleError(err, res);
    if (!hashRes) {
      console.log('could not authenticat: ' + req.auth.username);
      return res.status(401).json({msg: 'authenticat says no!'});
      ee.emit('generateToken', req, res, user);
    }
  });
});

ee.on('generateToken', function (req, res, user) {
  user.generateToken(function (err, token) {
    if (err) return handleError(err, res);
    res.json({token: token});
  });
});
