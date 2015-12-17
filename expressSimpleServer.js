// this section is our dependencies on other node modules and very similar code, more like #include in C, etc.
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
//var multer = require('multer');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;


// okay, sorta kinda start the server code here...

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

// we think passport authentication code has to be established first ? probably not..

passport.use(new PassportLocalStrategy(
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

  var user = undefined;

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
});

// XXX probably should actually wait for game and config files to be read and processed before we fire up express..
// equivalent is to wait for connection to database before going forward

var app = express(); // our workhorse node.js/io.js/node.io module, express, the apache replacement in our server side stack..

app.use(jsonParser);
app.use(urlencodedParser);
//app.use(multer({ dest: __dirname + '/tmp/'}));  //fails on this, maybe __dirname/tmp/ no good?

app.use(cookieParser());

app.use(express.static('.')); // serve static files under .  (do we need this to serve javascript files in this main directory?)
app.use('/cards',express.static('../cardImages/small/75')); // in client code (in html and js) can use 'cards' instead of longer path..

app.use(require('express-session')({ secret: 'change me!', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/gameloop',function(req, res) {
  console.log("got a GET request for /gameloop");
  res.sendFile(__dirname + '/' + 'gameLoop2.html'); // works
});

app.get('/poker',function(req, res) {
  console.log("got a GET request for /poker");
  //console.log("__dirname = ",__dirname);
  //  also return user cookie to browser for the session. 
  //  yes, in ths example we use the same html for logging in and when they're logged in
  if (req.user !== undefined){
    //res.cookie('user', req.user.id);
    res.cookie('user', req.user.username);
    console.log('/poker: user=', req.user);
    console.log('/poker: cookies=', req.cookies);
    console.log('/poker sending MultiPlayer version');
    res.sendFile(__dirname + '/PokerMultiPlayer.html');
  }
  else {
    res.cookie('user', 'none');
    console.log('/poker: user=', req.user);
    console.log('/poker: cookies=', req.cookies);
    console.log('/poker sending SinglePlayer version');
    res.sendFile(__dirname + '/PokerHand.html');
  }

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

/* if we want to look at what the form sends us we can run this code 
app.post('/test_login', urlencodedParser, function (req, res) { 
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
*/

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/poker',
    failureRedirect: '/poker',
    // failureFlash: true,
}));

app.get('/logout', function(req, res){
  console.log('Server trying to logout the user...');
  req.logout();
  //res.cookie("user","none");
  res.redirect('/poker');
});

function setMsg(args, user, response) {
  // save args.msg to the file "msg.txt". we DO NEED TO BE AUTHENTICATED to set the message.

  if (user === undefined){
    response.write(JSON.stringify({'err':'login for multiplayer'}));
    response.end();
  }
  else {
    fs.writeFile(__dirname + '/msg.txt', args.msg, function(err) {
      if (err) {
        response.write(JSON.stringify({'err':err}));
        response.end();
      }
      else {
        response.write(JSON.stringify({'result':'ok'}));
        response.end();
      }
    });
  }
}

function getMsg(args, user, response) {
  // load result from the file 'msg.txt'.   we don't need to be authenticated to get the message.

  fs.readFile(__dirname + '/msg.txt', function(err, data) {
    if (err) {
      response.write(JSON.stringify({'err':err}));
      response.end();
    }
    else {
      response.write(JSON.stringify({'result':data.toString()}));
      response.end();
    }
  });
}

app.all('/json/:cmd', function(request, response){
  // all /json/*,  so both post + get

  response.header("Cache-control", "no-cache"); // XXX what does this do?

  var user = request.user;
  var args = request.query;

  if        (request.params.cmd === 'setMsg') {
    setMsg(args, user, response);
  } else if (request.params.cmd === 'getMsg') {
    getMsg(args, user, response);
  } else {
    console.log('cmdHander unknown cmd: ', request.params.cmd);
    response.write(JSON.stringify({'err':'unkown cmd'}));
    response.end();
  }
});

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

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

});

