const expect = require('expect');
const chai = require('chai');
const expectChai = chai.expect;
const request = require('supertest');
var { ObjectID } = require('mongodb');


const app = require('../server');
const Todo = require('../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const User = require('./../models/user');


// beforeEach(()=>{
//   populateTodos;
//   populateUsers;
// });
beforeEach(populateUsers);
beforeEach(populateTodos);


describe('Post/todos',()=>{
  it('should create a new todo',(done)=>{
    var text = "test todo text";

    request(app)
      .post('/todos')
      .send({text})
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if(err) {
          return done('err');
        }

        Todo.find({text}).then((todos)=>{
          // console.log('iam ahere')
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err)=>{
          done(err);
        });
      });
  });

  it('should not create todo with invalid body data', (done)=>{
    var text="tw";

    request(app)
      .post('/todos')
      .send({text})
      .expect(400)
      .end((err,res)=>{
        if(err) {
          return done(err);
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((err)=> done(err));
      });
  });

});

describe('GET /users/me', ()=>{

  it('should return user by valid token',(done)=>{
    // console.log(users[1]);
    // console.log(users[1].tokens[0].token);

    request(app)
      .get('/users/me')
      .set('x-auth',users[1].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        // console.log('res.boday: ',res.body);
        expect(res.body._id).toBe(users[1]._id.toHexString());
        expect(res.body.email).toBe(users[1].email);
      }).end(done);

  });
  it('should return 401 for unkonwn token',(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth',users[0].tokens[0].token+'aa')
      .expect(401)
      .expect((res)=>{
        expect(res.body).toEqual({})
      })
      .end(done);
  });
});

describe('POST /users',()=>{

  // need clear db before, now depend on get test to clear

  it('should create a valid user',(done)=>{
    var email="abc@abc.com";
    var password="abc123!";

    request(app)
      .post('/users')
      .send({email,password})
      .expect(200)
      .expect(res=>{
        expect(res.headers['x-auth']).toExist;
        expect(res.body._id).toExist;
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err) {
          return done(err);
        }
        User.findOne({email}).then((user)=>{
          // console.log('after find user: ',user);
          expect(user).toExist;
          expectChai(user.password).to.not.equal(password);
          expect(user.email).toBe(email);
          done();
        }).catch(e=>done(e))

      });
  });

  it('should not create a invalid user',(done)=>{
    var email= 'andrewsx@X.com';
    var password= 'pass';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .expect(res=>{
        // console.log('should not create a invalid user: ',res);
      })
      .end(done);
  });
  it('should return validation errors if request invalid',(done)=>{
    request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: '12345678'
      })
      .expect(400)
      .end(done);
  });
});

describe('GET /todos', ()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
      }).end(done);
  });
});

describe('GET /todos/:id',()=>{
  it('should get todo', (done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text);
      }).end(done);
  });

  it('should return 404 if id is invalid',(done)=>{
    request(app)
      .get(`/todos/1234567890`)
      .expect(404)
      .end(done);
      
  })
  it('should return 404 if todo not found',(done)=>{
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
      
  })
});

describe('DELETE /todos/:id', ()=>{
  it('should remove a todo', (done)=>{
    var id = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(id);
      }).end((err, res)=>{
        if(err) {
          return done(err);
        }

        Todo.findById(id).then(todo=>{
          // expect(todo).toNotExist();
          // expect(todo).to.be.a.null;
          // console.log(todo);
          done();
        }).catch(e=>done(e));
      })

  });

  if('should return 404 if todo not found', (done)=>{
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
    
  });

  if('should return 404 if id is invalid', (done)=>{
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });
});

describe('PATCH /todos/:id', ()=>{
  it('should update the todo', (done)=>{
    var hexId = todos[0]._id.toHexString();

    request(app)
    .patch(`/todos/${hexId}`)
    .send({completed: true})
    .expect(200)
    .expect(res=>{
      // console.log(res.body);
      expect(res.body.todo.text).toBe(todos[0].text);
      expect(res.body.todo.completed).toBe(true);
      expectChai(res.body.todo.completedAt).to.be.a('number');
    }).end(done);

  });

  it('should clear completeAt when todo is not completed', (done)=>{
    var hexId = todos[1]._id.toHexString();
    
        request(app)
        .patch(`/todos/${hexId}`)
        .send({completed: false})
        .expect(200)
        .expect(res=>{
          expect(res.body.todo.text).toBe(todos[1].text);
          expect(res.body.todo.completed).toBe(false);
          expectChai(res.body.todo.completedAt).to.be.a('null');
        }).end(done);
  });
});

describe('POST /users/login', ()=>{
  // beforeEach(populateUsers);

  it('should login user and return auth token',(done)=>{
    request(app)
      .post('/users/login')
      .send({
        email: users[2].email,
        password: users[2].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist;
      })
      .end((err,res)=>{
        if(err) {
          return done(err);
        }

        // console.log('user3Id: ', users[2]._id);

        User.findById({_id: users[2]._id}).then((user)=>{
          // console.log('findby id user: ', user);
          expectChai(user.tokens[0]).to.deep.include({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e)=>{
          // console.log('find error:', e);
          done(e);
        });
      })
  });

  it('should rject invalid login',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[2].email,
      password: users[1].password
    })
    .expect(400)
    
    .end((err,res)=>{
      if(err) {
        return done(err);
      }
      done()
      // console.log('user3Id: ', users[2]._id);

    })
  });
});



