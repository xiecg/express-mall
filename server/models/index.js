
const mongoose = require('mongoose');
// const umongoUri = 'mongodb://chace:chace1011@172.16.249.30:19999/expressmall';
// const umongoUri = 'mongodb://chace:chace1011@0.0.0.0:19999/expressmall';
// const umongoUri = 'mongodb://chace:abc123@192.168.65.2:27017/expressmall';
const umongoUri = 'mongodb://127.0.0.1:27017/expressmall';

// 链接 MongoDB 数据库
const mongoClient = mongoose.createConnection(umongoUri, {
  useNewUrlParser: true
});

mongoClient.on('connected', () => {
  console.log('MongoDB connected success.');
});

mongoClient.on('error', (err) => {
  console.log('MongoDB connected fail.', err);
});

mongoClient.on('disconnected', (err) => {
  console.log('MongoDB connected disconnected.', err);
});

module.exports = mongoClient;
