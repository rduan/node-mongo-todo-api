// var mongoose = require('mongoose');

// mongoose.Promise = global.Promise;

// mongoose.connect('mongodb://localhost:37000/TodoApp');

var {mongoose} = require('./db/mongoose');

var Todo= require('./models/todo');
var User = require('./models/user');







var newTodo = new Todo({
  text: 'cooking',
  // completed: false,
  // completedAt: 123
  
});

// newTodo.save().then((doc)=>{
//   console.log('Saved', doc)
// }, (err)=>{
//   console.log(err);
// });



var newUser = new User({email: 'user@ab1.com'});

newUser.save().then((user)=>{
  console.log(user);
}, (err)=>{
  console.log(err);
})