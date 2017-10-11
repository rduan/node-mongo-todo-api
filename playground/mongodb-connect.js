const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:37000/TodoApp', (err, db)=>{
  if(err) {
    console.log('Unable to connect mongodb on 37000');
  }

  console.log('connect to mongo on 37000')
});
