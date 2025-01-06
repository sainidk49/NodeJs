const http = require('http');

const server = http.createServer((req, res)=>{
    res.end("Server start")
})
server.listen(3000, '192.168.1.108', () => {
    console.log('Server running at http://192.168.1.108:3000/');
})