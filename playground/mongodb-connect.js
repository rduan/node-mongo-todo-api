// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:37000/TodoApp', (err, db)=>{
  if(err) {
    console.log('Unable to connect mongodb on 37000');
    console.log(err);
    return;
  }

  console.log('connect to mongo on 37000');

  // db.collection('Todos').insertOne({text: 'something'},(err, result)=>{
  //   if(err) {
  //     return console.log('unable to insert todo', err);
  //   }

  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.collection('Users').insertOne({
    name: 'jack wang',
    age: 20,
    location: 'sydney'
  }, (err, result)=>{
      if(err) {
      return console.log('unable to insert todo', err);
    }
    console.log(result);
    console.log(JSON.stringify(result.ops, undefined, 2));
    console.log(result.ops[0]._id.getTimestamp());
  })

  db.close();

});
