//'use strict';

var gGamestateTimer;

function getGamestate() {
  var cmd = 'getGamestate';
  var xhr = new XMLHttpRequest();
  var url = '/json/' + cmd;
  xhr.open('POST', url, true);
  xhr.onload = function(xmlEvent) {
    var img; 
    var responseObject = JSON.parse(xhr.response);
    if ('err' in responseObject) {
      console.log('getGamestate: err = ', responseObject.err);
      //messageText.value = 'could not join game...';
    } else {


      if (responseObject.result.state !== gGameState.state ) {

        gGameState = responseObject.result;

        if (gGameState.state === 2) {

          img = document.getElementById('card0');
          if (gGameState.players[0].hand) {
            img.src = gDeckData[gGameState.players[0].hand[0]][3];
          }
          img = document.getElementById('card1');
          if (gGameState.players[0].hand) {
            img.src = gDeckData[gGameState.players[0].hand[1]][3];
          }
          img = document.getElementById('card2');
          if (gGameState.players[0].hand) {
            img.src = gDeckData[gGameState.players[0].hand[2]][3];
          }
          img = document.getElementById('card3');
          if (gGameState.players[0].hand) {
            img.src = gDeckData[gGameState.players[0].hand[3]][3];
          }
          img = document.getElementById('card4');
          if (gGameState.players[0].hand) {
            img.src = gDeckData[gGameState.players[0].hand[4]][3];
          }

          img = document.getElementById('player1card0');
          if (gGameState.players[1].hand) {
            img.src = gDeckData[gGameState.players[1].hand[0]][3];
          }
          img = document.getElementById('player1card1');
          if (gGameState.players[1].hand) {
            img.src = gDeckData[gGameState.players[1].hand[1]][3];
          }
          img = document.getElementById('player1card2');
          if (gGameState.players[1].hand) {
            img.src = gDeckData[gGameState.players[1].hand[2]][3];
          }
          img = document.getElementById('player1card3');
          if (gGameState.players[1].hand) {
            img.src = gDeckData[gGameState.players[1].hand[3]][3];
          }
          img = document.getElementById('player1card4');
          if (gGameState.players[1].hand) {
            img.src = gDeckData[gGameState.players[1].hand[4]][3];
          }

          //location.reload(); // XXX should not need this
        } else if (gGameState.state === -1) {

          img = document.getElementById('card0');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('card1');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('card2');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('card3');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('card4');
          img.src = '/cards/back-blue-75-3.png';

          img = document.getElementById('player1card0');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('player1card1');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('player1card2');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('player1card3');
          img.src = '/cards/back-blue-75-3.png';
          img = document.getElementById('player1card4');
          img.src = '/cards/back-blue-75-3.png';

          //location.reload(); // XXX should not need this
        }


      } 
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

        clearInterval(gGamestateTimer); // cancel getting gamestate regularly
        gGameStateTimer = undefined;

        setTimeout(getGamestate,1000*2); // but get state a few more times..
        setTimeout(getGamestate,1000*3);
        setTimeout(getGamestate,1000*4);
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
