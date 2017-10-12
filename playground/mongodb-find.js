// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:37000/TodoApp', (err, db)=>{
  if(err) {
    console.log('Unable to connect mongodb on 37000');
  }

  console.log('connect to mongo on 37000');

  //find all documents
  db.collection('Todos').find().toArray().then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err)=>{
    console.log(err);
  })

  db.collection('Todos').find().count().then((count)=>{
    console.log(count);
  }, (err)=>{
    console.log(err);
  });

  //_id is not a string, it is an ObjectID object
  db.collection('Todos').find({
    _id: new ObjectID('59ddedaa251c0f7e8eb3e9dc')
  })
    .toArray().then((docs)=>{
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err)=>{
    console.log(err);
  })

  db.close();

});
