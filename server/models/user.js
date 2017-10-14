var mongoose = require('../db/mongoose');
var userSchema = require('./userSchema');

var User = mongoose.model('User', userSchema);

module.exports = User;