const expect = require('expect');
const chai = require('chai');
const request = require('supertest');

const app = require('../server');
const Todo = require('../models/todo');

beforeEach((done)=>{
  Todo.remove({}).then(()=>done());
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

        Todo.find().then((todos)=>{
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
          expect(todos.length).toBe(0);
          done();
        }).catch((err)=> done(err));
      });
  });

});

