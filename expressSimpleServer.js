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

var cardDeck = require('./cardDeck');

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

  //console.log(' passport.deSerializeUser called: id=',id,' user=',user);

  cb(null, user);
});

/*
     'real' server execution actually starts here ?
*/

var gGameState = cardDeck.gGameState;

// read in our game and config files or connect to our database if we had one

fs.readFile(__dirname + '/users.json', 'utf8', function(err, data) {
    gGameState.players = JSON.parse(data).players;
    gGameState.state = 0;
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
app.use('/bigtrip',express.static('../web/lindbloom-airey/BigTrip')); // serve bigTrip web page
app.use('/john',express.static('../web/lindbloom-airey/familyfriends/john')); // serve bigTrip web page

// XXX need to understand this line better! no idea what the secret: field does...
app.use(require('express-session')({ secret: 'change me!', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/poker',
    failureRedirect: '/poker',
    // failureFlash: true,
}));

app.get('/logout', function(req, res){
  console.log('Server trying to logout the user...');
  // XXX really need to mark the user as no longer playing if they were playing. could have the client
  // side do this work; leave game before logging out if currently playing?
  req.user.playing = -1;
  req.logout();
  res.redirect('/poker');
});

app.get('/poker',function(req, res) {
  console.log("got a GET request for /poker");
  //console.log("__dirname = ",__dirname);
  //  also return user cookie to browser for the session. 
  //  yes, in ths example we use the same html for logging in and when they're logged in
  if (req.user !== undefined){
    //res.cookie('user', req.user.id);
    if (req.user.playing < 0) {
      req.user.playing = 0;
    }
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
    } else {
      response.write(JSON.stringify({'result':data.toString()}));
      response.end();
    }
  });
}

function joinGame(args, user, response) {


  if (0) { // XXX can't think of any error conditions, but I'm sure there will be some.
    response.write(JSON.stringify({'err':'error'}));
    response.end();
  } else {

    if (user.playing === 0) { // joinGame actually 'toggles' playing. 0: not playing, 1: playing.. more to come..
      user.playing = 1; // playing..
    } else {
      user.playing = 0; // not playing..
    }

    response.write(JSON.stringify({'result':gGameState})); // XXX not used on client side..
    response.end();
  }

  console.log('joinGame: user = ',user);
}

function getGamestate(args, user, response) {

  if (0) {
    response.write(JSON.stringify({'err':'error'}));
    response.end();
  } else {
    response.write(JSON.stringify({'result':gGameState}));
    response.end();
  }

  //console.log('getGamestate: user = ',user);
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
  } else if (request.params.cmd === 'joinGame') {
    joinGame(args, user, response);
  } else if (request.params.cmd === 'getGamestate') {
    getGamestate(args, user, response);
  } else {
    console.log('cmdHander unknown cmd: ', request.params.cmd);
    response.write(JSON.stringify({'err':'unkown cmd'}));
    response.end();
  }
});

app.post('/poker/singlePlayerCall', jsonParser, function(req, res) {
  console.log('got a POST request for /poker/singlePlayerCall');
  console.log('incoming from client:',req.body);
  var jsonResponse = {
    wallet: req.body.wallet - 1,
    andSomeOtherData: ' and thanks for playing, btw we charged you $1...'
  };
  var jsonString = JSON.stringify(jsonResponse);
  console.log('server response:',jsonString);
  res.end(jsonString);
});

// just for debugging, to see the current gamestate
// and to know that we can get the current gamestate to, for example, cheat, :-)
/*
app.get('/gamestate', function(req, res) {
  console.log("\ngot a GET request for /gamestate");
  var jsonString = JSON.stringify(gGameState);
  res.end(jsonString);
});
*/

// serve our little realtime gameloop html and javascript combo
app.get('/gameloop',function(req, res) {
  console.log('got a GET request for /gameloop');
  res.sendFile(__dirname + '/gameLoop2.html');
});

// This responds with the browser session cookies when asked for /cookies. mainly for debugging, etc.
app.get('/cookies', function(req, res) {
  console.log('Got a GET request for /cookies');
  console.log('Cookies: ', req.cookies);
  //res.send('Hello GET');
  res.end(JSON.stringify(req.cookies));
});

// This responds with... something.. to show we are alive
app.get('/', function(req, res) {
  console.log('Got a GET request for the homepage');
  //res.send('Hello GET');
  res.end(JSON.stringify({ proudlyServing: 'quality bits since late 2015' }));
});

var server = app.listen(8081, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);

  var gameCount = 0;        // available to anonymous run game function via closure...
  var numPlayersPlayingLastHand = 0;   // available to anonymous run game function via closure...
  var lastGameCount = 0;
  var interval = setInterval(function () {

    var numPlayersPlayingNextHand = 0;
    var i;
    var p0;
    var p1; 
    var p2;
    var p3;
    var p4;
    var p5;
    for (i = 0; i < gGameState.players.length; i++) {
      //console.log('gGameState.players[',i,']=',gGameState.players[i]);
      if (gGameState.players[i].playing >  0) {
        numPlayersPlayingNextHand += 1;
        if (!p0) {
          p0 = gGameState.players[i];
        } else if (!p1) {
          p1 = gGameState.players[i];
        } else if (!p2) {
          p2 = gGameState.players[i];
        } else if (!p3) {
          p3 = gGameState.players[i];
        } else if (!p4) {
          p4 = gGameState.players[i];
        } else if (!p5) {
          p5 = gGameState.players[i];
        }
      }
    }

    if (gGameState.state === 0 && numPlayersPlayingNextHand > 1) {
      console.log('time for a new hand to be dealt');
      console.log('state=',gGameState.state,'numPlayersPlayingNextHand=',numPlayersPlayingNextHand);


      // discard previously dealt hands..
      cardDeck.discardHand(p0.hand);    // XXX for now just the first two
      cardDeck.discardHand(p1.hand);

      // return discards to deck..
      cardDeck.returnDiscards();

      numPlayersPlayingLastHand = numPlayersPlayingNextHand; // XXX hmmm, could be same number, but different players..

      // deal hands to players that are playing.  (XXX for now just the first two..)
      cardDeck.dealHands(5,2, p0.hand, p1.hand);

      lastGameCount = gameCount;

      gGameState.state = 2; // cards dealt... (discards could take us back to state 1?)


    } else if (gGameState.state === 2) {
      if (gameCount > lastGameCount + 4) {
        console.log('cards dealt');
        console.log('state=',gGameState.state,'numPlayersPlayingNextHand=',numPlayersPlayingNextHand);
        console.log('---results---');

        var p0Result;
        var p1Result;

        if (p0) {
          p0Result = cardDeck.analyzeHand(p0.hand); // XXX should we be passing result? think so
          p0.result = p0Result; // XXX what exactly happened with this object copy?
        }

        if (p1) {
          p1Result = cardDeck.analyzeHand(p1.hand); // XXX same as above
          p1.result = p1Result;
        }

        if (p0Result && p1Result) {
          if (p0Result.handType === p1Result.handType) {
            if (p0Result.handRank === p1Result.handRank) {
              if (p0Result.handRank2 === p1Result.handRank2) {
                console.log('   ',p0.username,'splits the pot with',p1.username,': ',cardDeck.resultText(p0Result));
              }
              else if (p0Result.handRank2 > p1Result.handRank2) {
                console.log('   ',p0.username,'takes the pot with',cardDeck.resultText(p0Result));
              }
              else if (p0Result.handRank2 < p1Result.handRank2) {
                console.log('   ',p1.username,'takes the pot with',cardDeck.resultText(p1Result));
              }
            } else if (p0Result.handRank > p1Result.handRank) {
              console.log('   ',p0.username,'takes the pot with',cardDeck.resultText(p0Result));
            } else if (p0Result.handRank < p1Result.handRank) {
              console.log('   ',p1.username,'takes the pot with',cardDeck.resultText(p1Result));
            }
          } else if (p0Result.handType > p1Result.handType) {
            console.log('   ',p0.username,'takes the pot with',cardDeck.resultText(p0Result));
          } else if (p0Result.handType < p1Result.handType) {
            console.log('   ',p1.username,'takes the pot with',cardDeck.resultText(p1Result));
          }
        }
        else if (p0Result) {
          console.log('    only one player left playing so',p0.username,'takes the pot');
        }
        else if (p1Result) {
          console.log('    only one player left playing so',p1.username,'takes the pot');
        }
        else {
          console.log('    no results? nobody playing? should check what is in the pot');
        }
        console.log('^^^results computed^^^');

        gGameState.state = 3;
      }
    } else if (gGameState.state === 3) {
      console.log('hand over, winners should be known');
      console.log('state=',gGameState.state,'numPlayersPlayingNextHand=',numPlayersPlayingNextHand);

      if (gameCount > lastGameCount + 12) { // give clients time to get results..
        gGameState.state = 0;                 // start another hand

        // initialize player results..
        // XXX maybe we want to do a copy field by field, not have players all pointing to same
        // result? (or always generating a new result object like analyzeHand does?) (needs JS fact checking!)
        for (i = 0; i < gGameState.players.length; i++) {

          if (1) {
            gGameState.players[i].result.handType = -1;
            gGameState.players[i].result.handRank = -1;
            gGameState.players[i].result.handRank2 = -1;
            gGameState.players[i].result.card0 = -1;
            gGameState.players[i].result.card1 = -1;
            gGameState.players[i].result.card2 = -1;
            gGameState.players[i].result.card3 = -1;
            gGameState.players[i].result.card4 = -1;
          }
        }

      }
    } else {
      console.log('Game: count=',gameCount,'state=',gGameState.state,'numPlayers waiting=',numPlayersPlayingNextHand);
    }

    gameCount++;
    //console.log('...');
  },1000*2);  // run game step every 2 seconds.. 

});

