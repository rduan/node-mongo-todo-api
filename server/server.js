var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');

var Todo = require('./models/todo');
var User = require('./models/user');


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

app.listen(3000, () => {
  console.log('on 3000');

});



module.exports = app;