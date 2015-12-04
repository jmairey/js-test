// demonstration of authentication via passport and passport-local


//======================================
// our requires and similar dependencies
//======================================
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();
var cookieParser = require('cookie-parser');
var passport = require('passport');
var PassportLocalStrategy = require('passport-local').Strategy;


//======================================
//      passport user authentication
//======================================

//registering new users would be done by adding to these (global) data structures
var gIdToUser = [
    { id: 0, username: 'nobody', password: 'none', email: 'nobody@example.com' },
    { id: 1, username: 'bob', password: 'secret', email: 'bob@example.com' },
];
var gUsernameToId = {   // hmm, this makes it look like we don't search linearly but js probably does
  'bob': 1,
  'nobody' : 0,
};

passport.use(new PassportLocalStrategy(
    function(username, password, cb) {

        console.log(' passportServer verify username and password: ',username, ',', password);

        var user = gIdToUser[gUsernameToId[username]];

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
    }
));

passport.serializeUser(function(user, cb) {
    console.log('passport.serializeUser user=',user);
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    console.log('passport.DEserializeUser id=',id);
    cb(null, gIdToUser[id]);
});

//======================================
//      init/main
//======================================

var app = express(); // our workhorse node.js/io.js/node.io module, express, the apache replacement in our server side stack..

app.use(jsonParser);
app.use(urlencodedParser);

app.use(cookieParser());

app.use(require('express-session')({ secret: 'change me!', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local', {   
    successRedirect: '/passportDemo',
    failureRedirect: '/passportDemo',
//    failureFlash: true, 
}));

app.get('/logout', function(req, res){
    console.log('passportServer trying to logout the user...');
    req.logout();
    res.cookie("user","none");
    res.redirect('/passportDemo');
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

app.get('/passportDemo', function (request, response) {
    //  also return user cookie to browser for the session. 
    //  yes, in ths example we use the same html for logging in and when they're logged in
    if (request.user !== undefined){
        response.cookie('user', request.user.id);
    }
    else {
        response.cookie('user', 'none');
    }
    console.log('/passportDemo: user=', request.user);
    console.log('/passportDemo: cookies=', request.cookies);

    response.sendFile(__dirname + '/passportClient.html');
});

// Fire up the web server
var server = app.listen(8888, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("passportServer listening at http://%s:%s", host, port);

});

