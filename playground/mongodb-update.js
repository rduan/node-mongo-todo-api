const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:37000/TodoApp', (err, db)=>{
  if(err) {
    return console.log('errot to connect db');
  }

  console.log('connected');

  db.collection('Todos').findOneAndUpdate({text: 'from t3'},
      {
        $set: {
          complete: true
        }
      },
      {
        returnOriginal:false
      }).then((result)=>{
    console.log(result);
  });

  // delete one
  // db.collection('Todos').deleteOne({text: 'from t3'}).then((result)=>{
  //   console.log(result);
  // });


  // //find and delete
  // db.collection('Todos').findOneAndDelete({text: 'from t3'}).then((result)=>{
  //   console.log(result);
  // })


  db.close();
})
