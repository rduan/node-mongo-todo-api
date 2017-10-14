var mongoose = require('mongoose');
var Schema = mongoose.Schema;

userSchema= new Schema({
  email: {type:String, required: true,trim:true,minlength:5}
  
})

module.exports = userSchema;