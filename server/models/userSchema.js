'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema= new Schema({
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
  
});

userSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access},'secret').toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{
    return token;
  });
};

userSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// PredictorSchema.methods.setQuestions = function(questions){
//   this.collectors.each((c) => c.setQuestions(questions));
// };

module.exports = userSchema;