const {ObjectID} = require('mongodb');
const mongoose = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

var id = '59e29097bd8b1dd89bd6e691';
var userId = '59e2c7dcbaae19db60fb184a';

if(!ObjectID.isValid(id)) {
  console.log('id is not valid');
} else {
  console.log('id is valid');
}
/* 
Todo.find({
  _id: id
}).then((todos)=>{
  console.log(todos);
});

Todo.findOne({
  _id: id
}).then((todo)=>{
  console.log(todo);
});

Todo.findById({
  _id: id
}).then((todo)=>{
  if(!todo) {
    return console.log('Id not found');
  }
  console.log(todo);
}).catch((e)=>{
  console.log(e);
}); */

var user = new User({
  name:'nameTest',
  email: 'test@test.com'
})

/* user.save().then((user)=>{
  console.log(user);
}, (err)=>{
  console.log(err);
}); */

User.find().then((users)=>{
  console.log(users);
});

User.findOne({
  _id: userId
}).then((user)=>{
  console.log(user);
});

User.findById({
  _id: userId
}).then((user)=>{
  if(!user) {
    return console.log('Id not found');
  }
  console.log(user);
}).catch((e)=>{
  console.log(e);
});

