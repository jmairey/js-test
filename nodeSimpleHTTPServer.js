//Lets require/import the HTTP module
var http = require('http');

//Lets define a port we want to listen to
const PORT=8080;

//We need a function we which handles requess and sends responses
function handleRequest(request, response) {
  response.end('the HTTP server via node.js hit: ' + request.url);
}

//Create a server
var gServer = http.createServer(handleRequest);

//let's start our server
gServer.listen(PORT, function() {
  //Callback triggered when server is successfully listening.
  console.log("Server listening on: http://localhost:%s", PORT);
});

