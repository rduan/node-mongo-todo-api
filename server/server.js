var mongoose = require('mongoose');

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

newTodo.save().then((doc)=>{
  console.log('Saved', doc)
}, (err)=>{
  console.log(err);
});