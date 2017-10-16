const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const Todo = require('./../server/models/todo');
const User = require('./../server/models/user');

Todo.find({
  _id: '59e492a49cf121fb30f95955'
}).then((todos)=>{
  console.log(todos);
});

//findOneAndRemove
//findByIdAndRemove




Todo.remove({text:'First test todo'}).then((result)=>{
  console.log(result);
});

