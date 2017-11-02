var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test') {
  var config = require('./config.json');

  console.log(config);
  console.log(env);

  var envConfig = config[env];

  // console.log(Object.keys(envConfig));
  Object.keys(envConfig).forEach((key)=>{
    process.env[key] = envConfig[key];
  });
};

// console.log('env: ' + env);

// if (env === 'development') {
//   console.log('env: dev');
//   process.env.PORT = 6000;
//   process.env.MONGODB_URI = 'mongodb://localhost:37000/TodoApp';
// } else if (env === 'test') {
//   console.log('env: test');
//   process.env.PORT = 6000;
//   process.env.MONGODB_URI = 'mongodb://localhost:37000/TodoAppTest';
// }

