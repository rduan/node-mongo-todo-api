const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
  id: 10
}

var token = jwt.sign(data, 'saltseed');

console.log(token);

var decoded = jwt.verify(token,'saltseed');
console.log(decoded);

// var message = 'i m user 3';

// var hash= SHA256(message).toString();

// console.log(message);
// console.log(hash);

// var data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data)+'salt').toString()
// }

// token.data.id =5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data)+'salt').toString();

// if(resultHash === token.hash) {
//   console.log('authenticated');
// } else {
//   console.log('not trust');
// }

