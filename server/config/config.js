var env = process.env.NODE_ENV || 'development';

console.log('env: ' + env);

if (env === 'development') {
  process.env.PORT = 6000;
  process.env.MONGODB_URI = 'mongodb://localhost:37000/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 6000;
  process.env.MONGODB_URI = 'mongodb://localhost:37000/TodoAppTest';
}

