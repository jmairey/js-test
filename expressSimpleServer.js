// this section is our dependencies on other node modules and very similar code, more like #include in C, etc.
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var multer = require('multer');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;


// define some functions for use by server code below

function findUser(username) {
  //console.log('in findUser, looking for ',username);
  //console.log('in findUser, gGameState.players = :',gGameState.players);
  var i; 
  for (i = 0; i < gGameState.players.length; i++) {
    var player = gGameState.players[i];
    if (username === player.username) {
      //console.log(' findUser found player username ');
      return player;
    }
  }

  console.log(' findUser did not find username ',username);
  return undefined;
}

// we think passport authentication code has to be established first ?

passport.use(new Strategy(
  function verify(username,password, cb) {
    console.log(' passport verify username and password: ',username, ',', password);

    var user = findUser(username);

    if (user === undefined) {
      console.log(' passport verify could not find username:', username);
      cb(null, undefined);
    } else if (user.password !== password) {
      console.log(' passport found matching player username:',username,' but PASSWORD ', password, ' DID NOT MATCH ');
      cb(null, undefined);
    } else {
      console.log(' passport verify found matching player username ',username,' and password ',password);
      cb(null, user);
    }
  })
);


passport.serializeUser(function(user, cb) {

  console.log(' passport.serializeUser called: user=', user);
  var userId = -1; 
  if (user) {
    userId = user.id;
  }
  cb(null, userId);
});

passport.deserializeUser(function(id, cb) {

  var user = { 
    username: 'nobody', 
    password: 'none',
    id: 0,
    wallet: 0,
    playing: false,
  };

  if (id > 0 && id <= gGameState.players.length) {
    user = gGameState.players[id-1];
  }

  console.log(' passport.deSerializeUser called: id=',id,' user=',user);

  cb(null, user);
});

/*
     'real' server execution actually starts here ?
*/

var gGameState = {
    state: -1,
    pot: 0,
    players: [],
};

// read in our game and config files or connect to our database if we had one

fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {

    gGameState.players = JSON.parse(data).players;
    //var jsonString = JSON.stringify(gGameState);
    //console.log(jsonString);
    //console.log(gGameState.players);
});

// XXX probably should actually wait for game and config files to be read and processed before we fire up express..
// equivalent is to wait for connection to database before going forward

var app = express(); // our workhorse node.js/io.js/node.io module, express, the apache replacement in our server side stack..

app.use(jsonParser);
app.use(urlencodedParser);
//app.use(multer({ dest: __dirname + '/tmp/'}));  //fails on this, maybe __dirname/tmp/ no good?

app.use(cookieParser());

//app.use(express.static('..')); // serve static files under ..
app.use(express.static('.')); // serve static files under . 
app.use('/cards',express.static('../cardImages/small/75')); // in client code (in html and js) can use 'cards' instead of longer path..

app.use(passport.initialize());
app.use(passport.session());

app.get('/gameloop',function(req, res) {
  console.log("got a GET request for /gameloop");
  //console.log("__dirname = ",__dirname);
  res.sendFile(__dirname + '/' + 'gameLoop2.html'); // works
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

/* if we want to look at what the form sends us we can run this code */
//app.post('/test_login', urlencodedParser, function (req, res) {   // also works
app.post('/test_login', jsonParser, function (req, res) {
  console.log("got a POST request for /login");
  console.log('incoming from client:',req.body);
  var jsonResponse = {
    username: 'bob',
    password: 'secret',
    andSomeOtherData: ' yes, and some other data',
  };
  var jsonString = JSON.stringify(jsonResponse);
  console.log('server response:',jsonString);
  res.end(jsonString);
});

app.post('/login', 
  passport.authenticate('local', 
    { 
      successRedirect: '/cards/back-blue-75-3.png',
      failureRedirect: '/cards/back-red-75-3.png',
      failureFlash: true
    }));

app.get('/list_user', function(req, res) {
  console.log("\ngot a GET request for /list_user");
  fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {

    // since our file is already json, we don't have to parse it. although we could..

    //var json = JSON.parse(data);
    //var jsonString = JSON.stringify(json);
    //res.end(jsonString);

    res.end(data);
  });
  //res.send('Page Listing');
});

// This responds with the cookies when asked for /
app.get('/', function(req, res) {
  console.log("Got a GET request for the homepage");
  console.log("Cookies: ", req.cookies);
  //res.send('Hello GET');
  res.end(JSON.stringify(req.cookies));
});

/*
///  this is for another demo with index.htm
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

app.get('/ab*cd', function(req, res) {
  console.log("Got a GET request for /ab*cd");
  res.send('Page Pattern Match');
});
*/

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});

