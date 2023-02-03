/* Load the HTTP library */
var http = require('http');

/* Create an HTTP server to handle responses */

http
  .createServer(function(request, response) {
    // 200 refers to the status code
    // 200 is good
    // 400 means bad response
    // 500 is an internal server
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Hello World');
    response.end();
  })
  // port
  .listen(3001);