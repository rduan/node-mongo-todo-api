'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
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
    token: {
      type: String,
      required: true
    }
  }]

});

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();

  user.tokens.push({ access, token });

  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

// PredictorSchema.methods.setQuestions = function(questions){
//   this.collectors.each((c) => c.setQuestions(questions));
// };

userSchema.statics.findByToken = function (token) {

  console.log('xxxx---  findbyToken')
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'secret');
  } catch (e) {
    // console.log('catought exception');
    // console.log(e);
    // return new Promise((resolve, reject)=>{
    //   reject()
    // })
    return Promise.reject();

  }

  console.log('ok, found token: ', decoded);
  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

userSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      })

    })
  } else {
    next();
  }
})

module.exports = userSchema;