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

// app.get('/')

app.listen(3000, () => {
  console.log('on 3000');

});


// var newTodo = new Todo({
//   text: 'cooking',
//   // completed: false,
//   // completedAt: 123

// });

// newTodo.save().then((doc)=>{
//   console.log('Saved', doc)
// }, (err)=>{
//   console.log(err);
// });



// var newUser = new User({email: 'user@ab1.com'});

// newUser.save().then((user)=>{
//   console.log(user);
// }, (err)=>{
//   console.log(err);
// })

module.exports = app;