const { ObjectID } = require('mongodb');
const Todo = require('./../../models/todo');
const User = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id: userOneId,
  email: 'andrew@sx.com',
  password: 'passwdone',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth' }, 'secret').toString()
    // token: jwt.sign({ _id: userOneId.toHexString(), access: 'auth' }, 'secret').toString()
  }]

  // var access = 'auth';
  // var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();
},
{
  _id: userTwoId,
  email: 'ajack@sx.com',
  password: 'passwdtwo',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userTwoId.toHexString(), access: 'auth' }, 'secret').toString()
  }]
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => Todo.insertMany(todos)).then(() => done());
}

const populateUsers = (done) => {
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo])    
  }).then(()=> done());
}

module.exports = { todos, populateTodos, users, populateUsers };