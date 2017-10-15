let Todo = require('./../models/todo');

let findById=(id)=>{
  Todo.findById({
    _id: id
  }).then((todo)=>{
    if(!todo) {
      return console.log('Id not found');
    }
    // console.log(todo);
    return todo;
  }).catch((e)=>{
    console.log(e);
  })

}



module.exports = {findById}