const expect = require('expect');
const chai = require('chai');
const expectChai = chai.expect;
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('../server');
const Todo = require('../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done)=>{
  Todo.remove({}).then(()=> Todo.insertMany(todos)).then(()=>done());
});

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
          console.log('iam ahere')
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
          console.log(todo);
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
      console.log(res.body);
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
  })
})


