var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');

userSchema= new Schema({
  email: {
    type:String, 
    required: true,
    trim:true,
    minlength:5,
    unique: true,
    validate: {
      // validator: (value)=>{
      //   return validator.isEmail(value);
      // },
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true    
    }
  }]
  
})

module.exports = userSchema;