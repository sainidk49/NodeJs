const http = require('http');

const server = http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    const headersString = JSON.stringify(req.headers, null, 2);
    res.end(headersString)
})
server.listen(3000, '192.168.1.68', () => {
    console.log('Server running at http://192.168.1.68:3000/');
})