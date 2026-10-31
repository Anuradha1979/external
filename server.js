
const http = require('http');

const server = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('hello your node.js server is working');
});

server.listen(3000, () => {
    console.log('listening at port 3000');
});
