var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/beverages_test');
process.env.APP_SECRET = process.env.APP_SECRET || 'changemechangemechangeme';

var usersRouter = require('./routes/users_routes');
var router = require('./routes/routes');
app.use('/api', usersRouter);
app.use('/api', router);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('server up on port: ' + port);
});
