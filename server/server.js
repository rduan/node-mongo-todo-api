var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var { mongoose } = require('./db/mongoose');

var Todo = require('./models/todo');
var User = require('./models/user');
var todoRepo = require('./repositories/todoRepository');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  console.log(req.body);
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {

    res.status(200).send(doc);
  }, (err) => {
    // console.log(err);
    res.status(400).send(err);
  })
});

app.get('/todos', (req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (err)=>{
    // console.log(err);
    res.status(400).send(err);
  })
});

app.get('/todos/:id', (req,res)=>{
  // res.send(req.params);
  let id = req.params.id;
  if(!ObjectID.isValid(id)) {
    res.status(404).send('bad id');
  };

  // let todo = todoRepo.findById(id);
  // console.log(todo);

  Todo.findById({
    _id: id
  }).then((todo)=>{
    if(!todo) {
      // return console.log('Id not found');
      res.status(404).send({})
    }
    // console.log(todo);
    // res.status(200).send({todo});
    res.send({todo});
    
    
  }).catch((e)=>{
    // console.log(e);
    res.status(400).send();
  })

  // res.status(200).send(todo);




});

app.listen(3000, () => {
  console.log('on 3000');

});



module.exports = app;