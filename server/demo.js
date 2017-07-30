
const http = require('http');
const url = require('url');
const util = require('util');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/pain', 'chatset=utf-8');

  res.end(`hello, node.js ${ util.inspect( url.parse(req.url)) }`);
});

server.listen(3000, '127.0.0.1', () => {
  console.log('end');
});