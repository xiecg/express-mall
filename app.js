const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('hello world.');
}).listen(3000);

console.log('server running on http://121.196.200.74:8081/');