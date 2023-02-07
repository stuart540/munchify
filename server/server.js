/* Load the HTTP library */
var http = require('http');
var request = require('request'); // "Request" library

var client_id = 'c3f1191681964245b5168f0a0f0e5369'; // Your client id
var client_secret = 'b9a75c49979941f2a45b338ba98df17e'; // Your secret

/* Create an HTTP server to handle responses */

// http
//   .createServer(function(request, response) {
//     // 200 refers to the status code
//     // 200 is good
//     // 400 means bad response
//     // 500 is an internal server
//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.write('Hello World');
//     response.end();
//   })
//   // port
//   .listen(3001);

  // application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {

    // use the access token to access the Spotify Web API
    var token = body.access_token;
    var options = {
      url: 'https://api.spotify.com/v1/users/jmperezperez',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      console.log(body);
      console.log(token);
      getPlaylist(token)
    });
  }
});