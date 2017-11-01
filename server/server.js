require('./config/config');


var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

var { mongoose } = require('./db/mongoose');

var Todo = require('./models/todo');
var User = require('./models/user');
var todoRepo = require('./repositories/todoRepository');
var authenticate = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 6000;

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



//
app.get('/users/me', authenticate, (req,res)=>{
  res.send(req.user);
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  
  // console.log(req.body);
  var user = new User(body);

  user.save().then(() => {
    // create user should not create token, token used when user logged in
    return user.generateAuthToken();
  }).then((token)=> {
    res.header('x-auth', token).send(user);
  }).catch((err)=>{

    res.status(400).send(err);
  })
});

//delete token
app.delete('/users/me/token', authenticate, (req, res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, ()=>{
    res.status(400).send();
  })
});


//user login
app.post('/users/login', (req,res)=>{

  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user)=>{
    // res.send(user);
    // console.log('~~~~~ before generate auth token')

    // carefully, user.generateAuthToken(), not User.generateAuthToken()

    return user.generateAuthToken().then((token)=>{
      res.header('x-auth',token).send(user);
    })
    // return res.header('x-auth', user.tokens[0].token).send(user);
  }).catch((e)=>{
    console.log('generate token error: ',e )
    res.status(400).send();
  });
  // var user = new User(body);

  // var token = user.generateAuthToken();

  // User.findByToken(token).then((user)=>{
  //   if(!user) {
  //     console.log('can not find');
  //     return Promise.reject();
  //   }
  //   // res.send(user);
  //   req.user = user;
  //   req.token = token;
  // }).catch((e)=>{
  //   res.status(401).send();
  // });


  
  // res.send(req.user);

});



app.get('/todos', (req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  }, (err)=>{
    console.log(err);
    res.status(400).send(err);
  })
});



//

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

app.delete('/todos/:id', (req, res)=>{
  let id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  // var todo = Todo.findById({_id: id}).then((todo)=>{

  // })
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo) {
      return res.status(404).send();

    }

    res.send({todo});
  }).catch((err)=>{
    res.status(400).send();
  })


});

app.patch('/todos/:id', (req,res)=>{
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID(id)) {
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();

  }else {
    body.completed = false;
    body.completedAt = null;
  }
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
    if(!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch(err=>res.status(404).send());


});

app.listen(port, () => {
  console.log('started on '+ port);

});



module.exports = app;