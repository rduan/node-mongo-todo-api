var mongoose = require('mongoose');
var userSchema = require('./userSchema');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:37000/TodoApp');





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

var User = mongoose.model('User', userSchema);

var newUser = new User({email: 'user@ab.com'});

newUser.save().then((user)=>{
  console.log(user);
}, (err)=>{
  console.log(err);
})