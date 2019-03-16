const mongoose = require('mongoose')
const dbUrl = 'mongodb://127.0.0.1:27017/ticket'

mongoose.connect(dbUrl, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
  console.log('Mongoose connection open to' + dbUrl);
})

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error' + err);
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected');
})

module.exports = mongoose