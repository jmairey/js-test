
var gUsername;

function hasSessionCookie(){
  var cookieArray = document.cookie.split(';');
  var cookies = {};
  for (var i = 0; i < cookieArray.length; i++){
    var parts = cookieArray[i].split('=');
    var key = parts[0].trim();
    var value = parts[1];
    cookies[key] = value;
  }

  //user will be a username if they're logged in
  if (cookies['user'] !== 'none') {
    gUsername = cookies['user'];
    return true;
  }
  return false;
}

function authenticationInit() {

  var getButton = document.getElementById("getButton");
  var setButton = document.getElementById("setButton");
  var messageText = document.getElementById("messageText");
  var logOutButton = document.getElementById("logOutButton");

  if (hasSessionCookie()){
      document.getElementById('login').style.display = 'none';
      messageText.value = 'Welcome ' + gUsername + '!';
      var gameDirections = document.getElementById("gameDirections");
      gameDirections.innerHTML = 'Welcome ' + gUsername + '! :-)';
  }
  else {
      messageText.value = 'login for multiplayer';
  }

  getButton.onclick = function() {
    var cmd = 'getMsg';
    var xhr = new XMLHttpRequest();
    var url = '/json/' + cmd;
    xhr.open('POST', url, true);
    xhr.onload = function(xmlEvent) {
        var responseObject = JSON.parse(xhr.response);
        if ('err' in responseObject) {
            console.log('getMsg: err = ', responseObject.err);
            messageText.value = 'could not get msg...';
        } else {
            console.log('getMsg: result = ' + responseObject.result);
            messageText.value = responseObject.result;
        }
    };
    xhr.send();
  };

  setButton.onclick = function() {
    var cmd = 'setMsg';
    var xhr = new XMLHttpRequest();
    var url = '/json/' + cmd + '?' + 'msg=' + messageText.value;
    xhr.open('POST', url, true);
    xhr.onload = function(xmlEvent) {
      var responseObject = JSON.parse(xhr.response);
      if ('err' in responseObject) {
        console.log(responseObject.err);
        console.log('setMsg: err = ' + responseObject.err);
        messageText.value = responseObject.err;
      } else {
        console.log('setMsg: result = ' + responseObject.result);
        messageText.value = responseObject.result;
      }
    };
    xhr.send();
  };

  logOutButton.onclick = function() {

    if (hasSessionCookie()){
      console.log('trying to log out');
      messageText.value = 'logging out...';

      var xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
 
          location.reload();   // XXX not sure why we need this to reload single player page?

          messageText.value = '...bye!';
          document.getElementById('login').style.display = '';
          var gameDirections = document.getElementById("gameDirections");
          gameDirections.innerHTML = 'play single player or login to join a server hosted game, :-)'
          gUsername=undefined;
        }
        else {
          console.log('readyState = ',xhr.readyState);
          console.log('status = ',xhr.status);
          messageText.value = '..good...';
        }
      }

      xhr.open('GET', '/logout', true)
      xhr.send();

    }
    else {
      console.log('already logged out');
      messageText.value = 'login for multiplayer';
    }
  };
}
