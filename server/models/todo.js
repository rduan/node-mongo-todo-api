// var mongoose = require('../db/mongoose');
var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  text: {
    //type: string
    type: String,
    required: true,
    minlength: 3,
    trim: true


  },
  completed: {
    // type: boolean
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

module.exports =  Todo;