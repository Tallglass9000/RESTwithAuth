//This code is from classes, Sept. 16, 2015
var events = require('events');
var ee = new events.EventEmitter();
var eat = require('eat');
var User = require(__dirname + '/../models/user');
var handleError = require(__dirname + '/handle_error');

module.exports = function (req, res, next) {
  var encryptedToken = req.headers.token || (req.body? req.body.token: undefined);
  if (!encryptedToken) 
    return res.status(401).json({msg: 'could not authenticat'});
  eat.decode(encryptedToken, process.env.APP_SECRET, function (err, token) {
    if (err) return handleError(err, res);

    User.findOne({_id: token.id}, function(err, user) {
      if (err) handleError(err, res);
      if (!user) res.status(401).json({msg: 'could not authenticat'});
      req.user = user;
      next();
    });
  });
};