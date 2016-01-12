//'use strict';

var gGamestateTimer;

function getGamestate() {
  var cmd = 'getGamestate';
  var xhr = new XMLHttpRequest();
  var url = '/json/' + cmd;
  xhr.open('POST', url, true);
  xhr.onload = function(xmlEvent) {
    var responseObject = JSON.parse(xhr.response);
    if ('err' in responseObject) {
      console.log('getGamestate: err = ', responseObject.err);
      //messageText.value = 'could not join game...';
    } else {

      gGameState = responseObject.result;
    }
  };
  xhr.send();
}

function joinGame(buttonObj) {
  alert(buttonObj.value);
  var cmd = 'joinGame';
  var xhr = new XMLHttpRequest();
  var url = '/json/' + cmd;
  xhr.open('POST', url, true);
  xhr.onload = function(xmlEvent) {
    var responseObject = JSON.parse(xhr.response);
    if ('err' in responseObject) {
      console.log('joinGame: err = ', responseObject.err);
      messageText.value = 'could not join game...';
    } else {

      gGameState = responseObject.result;

      if (buttonObj.value === 'Join Next Hand') {
        messageText.value = 'joined game!';
        buttonObj.value = 'leave game'

        // Should set up long polling or regular setInterval style polling to get the gamestate from the server
        gGamestateTimer = setInterval(getGamestate,1000*2); // every 2 seconds

      } else {
        messageText.value = 'left game!';
        buttonObj.value = 'Join Next Hand';

        clearInterval(gGamestateTimer); // cancel getting gamestate
        gGameStateTimer = undefined;
      }

    }
  };
  xhr.send();
}

function discardCurrentCard(buttonObj) {
  alert(buttonObj.value);
}

function doneDiscard(buttonObj) {
  alert(buttonObj.value);
}

function foldHand(buttonObj) {
  alert(buttonObj.value);
}

function callGame(buttonObj){
  alert(buttonObj.value);
  //alert(buttonObj.type);
}

function initMultiplayer(){
  authenticationInit();
}

window.onload =initMultiplayer;
