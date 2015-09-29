var mongoose = require('mongoose');

var BeverageSchema = new mongoose.Schema ({
  name : String,
  user: String
});

module.exports = mongoose.model('Beverage', BeverageSchema);