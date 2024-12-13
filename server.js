//using .mjs extentsion so Node.js can recognize the file as a module
//NOTE: would use .mjs or flag with --experimental-modules in terminal

const http = require('http'),
 fs = require('fs'),
 url = require('url');

http.createServer((request, response) => {
    let addr = request.url,
    q = new URL(addr, 'http://' + request.headers.host),
    filePath = '';

fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
        console.error('Error writing to log.txt', err);
    } else {
        console.log('Added to log.')
           }
    });
    
    if (q.pathname.includes('documentation')) {
        filePath = (__dirname + '/documentation.html');
    } else {
        console.log('Bad URL, redireting to home');
        filePath = 'index.html';
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, { 'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });

}).listen(8080);
console.log('My first node test server is runnning on port 8080');
