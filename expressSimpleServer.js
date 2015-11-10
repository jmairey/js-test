var express = require('express');
var app = express();
var fs = require('fs');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var multer = require('multer');

var cookieParser = require('cookie-parser');

app.use(jsonParser);
app.use(urlencodedParser);
//app.use(multer({ dest: __dirname + '/tmp/'}));  //fails on this, probably /tmp/ no good

app.use(cookieParser());

app.use(express.static('..')); // serve static files under ..
app.use(express.static('.')); // serve static files under . 

app.get('/gameloop',function(req, res) {
  console.log("got a GET request for /gameloop");
  //console.log("__dirname = ",__dirname);
  res.sendFile(__dirname + '/' + 'gameLoop2.html');
});

app.get('/poker',function(req, res) {
  console.log("got a GET request for /poker");
  //console.log("__dirname = ",__dirname);
  res.sendFile(__dirname + '/' + 'PokerHand.html');
});

app.post('/poker/call', jsonParser, function(req, res) {
  console.log("got a POST request for /poker/call");
  console.log('incoming from client:',req.body);
  var jsonResponse = {
    wallet: req.body.wallet - 1,
    andSomeOtherData: ' and thanks for playing, btw we charged you $1...'
  };
  var jsonString = JSON.stringify(jsonResponse);
  console.log('server response:',jsonString);
  res.end(jsonString);
});

app.get('/list_user', function(req, res) {
  console.log("\ngot a GET request for /list_user");
  fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {
    //var json = JSON.parse(data);
    //var jsonString = JSON.stringify(json);
    //res.end(jsonString);

    res.end(data);
  });
  //res.send('Page Listing');
});

app.get('/index.htm', function(req, res) {
  console.log("Got a GET request for index.htm ");
  res.sendFile(__dirname + '/' + 'index.htm');
});

app.get('/process_get', function(req, res) {
  // prepare output in JSON format
  var response = {
    first_name:req.query.first_name,
    last_name:req.query.last_name,
  };
  console.log(response);
  res.end(JSON.stringify(response));
});

app.post('/process_post', urlencodedParser, function (req, res) {

  // prepare output in JSON format
  var response = {
    first_name:req.body.first_name,
    last_name:req.body.last_name,
  };
  console.log(response);
  res.end(JSON.stringify(response));

});


// This responds with 'Hello GET' on the home page.
app.get('/', function(req, res) {
  console.log("Got a GET request for the homepage");
  console.log("Cookies: ", req.cookies);
  //res.send('Hello GET');
  res.end(JSON.stringify(req.cookies));
});

app.post('/file_upload', function(req, res) {
  //console.log(req);
  // seems like this property files doesn't exist in req.

  console.log(req.files.file.name);
  console.log(req.files.file.path);
  console.log(req.files.file.type);

  var file = __dirname + '/' + req.files.file.name;

  fs.readFile(req.files.file.path, function(err, data) {
    fs.writeFile(file, data, function(err) {
      if (err) {
        console.log(err);
      } else {
        var response = {
          message:'File uploaded successfully',
          filename:req.files.file.name,
        };
      }
      console.log(response);
      res.end(JSON.stringify(response));
    });
  });
});
/*

app.post('/', function(req, res) {
  console.log("Got a POST request for the homepage");
  res.send('Hello POST');
});

app.get('/del_user', function(req, res) {
  console.log("Got a DELETE request for /del_user");
  fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {
    var json = JSON.parse(data);
    delete json['user2'];
    console.log(json);
    res.end(JSON.stringify(json));
  });
});


app.get('/:id', function(req, res) {
  //first read existing users
  fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {
    var json = JSON.parse(data);
    var user = json["user" + req.params.id];
    console.log(user);
    res.end(JSON.stringify(user));
  });
});

var user = {
  "user4" : {
    "name" : "mohit",
    "password" : "password4",
    "profession" : "teacher",
    "id": 4,
  }
};

app.get('/add_user', function(req, res) {
  // first read existing users
  fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {
    data = JSON.parse(data);
    data["user4"] = user["user4"];
    console.log(data);
    res.end(JSON.stringify(data));
  });
});
*/

app.get('/ab*cd', function(req, res) {
  console.log("Got a GET request for /ab*cd");
  res.send('Page Pattern Match');
});

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});

