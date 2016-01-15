//'use strict';

var gGamestateTimer;

var gId;

function getGamestate() {
  var gameDirections = document.getElementById('gameDirections');
  var cmd = 'getGamestate';
  var xhr = new XMLHttpRequest();
  var url = '/json/' + cmd;
  xhr.open('POST', url, true);
  xhr.onload = function(xmlEvent) {
    var img; 
    var responseObject = JSON.parse(xhr.response);
    var i;
    var j;
    if ('err' in responseObject) {
      console.log('getGamestate: err = ', responseObject.err);
      //messageText.value = 'could not join game...';
    } else {
      var nextState = responseObject.result;
      var p0 = 0;
      var p1 = 1;
      var p2 = 2;
      var p3 = 3;
      var p4 = 4;
      var p5 = 5;

      for (i = 0; i < nextState.players.length; i++) {
        if (nextState.players[i].username === gUsername) {
          gId = nextState.players[i].id-1;
        }
      }

      if        (gId === 1) {
        p0 = gId; 
        p1 = 0;
      } else if (gId === 2) {
        p0 = gId; 
        p2 = 0;
      } else if (gId === 3) {
        p0 = gId; 
        p3 = 0;
      } else if (gId === 4) {
        p0 = gId; 
        p4 = 0;
      } else if (gId === 5) {
        p0 = gId; 
        p5 = 0;
      }

      if (nextState.state !== gGameState.state ) {

        if (nextState.state === 2) {

          if (nextState.players[p0].hand.length === 5 && nextState.players[p0].playing > 0) {
            document.getElementById('card0').src = gDeckData[nextState.players[p0].hand[0]][3];
            document.getElementById('card1').src = gDeckData[nextState.players[p0].hand[1]][3];
            document.getElementById('card2').src = gDeckData[nextState.players[p0].hand[2]][3];
            document.getElementById('card3').src = gDeckData[nextState.players[p0].hand[3]][3];
            document.getElementById('card4').src = gDeckData[nextState.players[p0].hand[4]][3];

          }

          if (nextState.players[p1].hand.length === 5 && nextState.players[p1].playing > 0) {
            document.getElementById('player1card0').src = gDeckData[nextState.players[p1].hand[0]][3];
            document.getElementById('player1card1').src = gDeckData[nextState.players[p1].hand[1]][3];
            document.getElementById('player1card2').src = gDeckData[nextState.players[p1].hand[2]][3];
            document.getElementById('player1card3').src = gDeckData[nextState.players[p1].hand[3]][3];
            document.getElementById('player1card4').src = gDeckData[nextState.players[p1].hand[4]][3];
          }

          if (nextState.players[p2].hand.length === 5 && nextState.players[p2].playing > 0) {
            document.getElementById('player2card0').src = gDeckData[nextState.players[p2].hand[0]][3];
            document.getElementById('player2card1').src = gDeckData[nextState.players[p2].hand[1]][3];
            document.getElementById('player2card2').src = gDeckData[nextState.players[p2].hand[2]][3];
            document.getElementById('player2card3').src = gDeckData[nextState.players[p2].hand[3]][3];
            document.getElementById('player2card4').src = gDeckData[nextState.players[p2].hand[4]][3];
          }

          if (nextState.players[p3].hand.length === 5 && nextState.players[p3].playing > 0) {
            document.getElementById('player3card0').src = gDeckData[nextState.players[p3].hand[0]][3];
            document.getElementById('player3card1').src = gDeckData[nextState.players[p3].hand[1]][3];
            document.getElementById('player3card2').src = gDeckData[nextState.players[p3].hand[2]][3];
            document.getElementById('player3card3').src = gDeckData[nextState.players[p3].hand[3]][3];
            document.getElementById('player3card4').src = gDeckData[nextState.players[p3].hand[4]][3];
          }

          if (nextState.players[p4].hand.length === 5 && nextState.players[p4].playing > 0) {
            document.getElementById('player4card0').src = gDeckData[nextState.players[p4].hand[0]][3];
            document.getElementById('player4card1').src = gDeckData[nextState.players[p4].hand[1]][3];
            document.getElementById('player4card2').src = gDeckData[nextState.players[p4].hand[2]][3];
            document.getElementById('player4card3').src = gDeckData[nextState.players[p4].hand[3]][3];
            document.getElementById('player4card4').src = gDeckData[nextState.players[p4].hand[4]][3];
          }

          if (nextState.players[p5].hand.length === 5 && nextState.players[p5].playing > 0) {
            document.getElementById('player5card0').src = gDeckData[nextState.players[p5].hand[0]][3];
            document.getElementById('player5card1').src = gDeckData[nextState.players[p5].hand[1]][3];
            document.getElementById('player5card2').src = gDeckData[nextState.players[p5].hand[2]][3];
            document.getElementById('player5card3').src = gDeckData[nextState.players[p5].hand[3]][3];
            document.getElementById('player5card4').src = gDeckData[nextState.players[p5].hand[4]][3];
          }

          gameDirections.innerHTML = 'cards are dealt';

          //location.reload(); // XXX should not need this?
        } else if (nextState.state === 0 && gGameState.state >= 0) {

          document.getElementById('card0').src = '/cards/back-blue-75-3.png';
          document.getElementById('card1').src = '/cards/back-blue-75-3.png';
          document.getElementById('card2').src = '/cards/back-blue-75-3.png';
          document.getElementById('card3').src = '/cards/back-blue-75-3.png';
          document.getElementById('card4').src = '/cards/back-blue-75-3.png';

          document.getElementById('player1card0').src = '/cards/back-blue-75-3.png';
          document.getElementById('player1card1').src = '/cards/back-blue-75-3.png';
          document.getElementById('player1card2').src = '/cards/back-blue-75-3.png';
          document.getElementById('player1card3').src = '/cards/back-blue-75-3.png';
          document.getElementById('player1card4').src = '/cards/back-blue-75-3.png';

          document.getElementById('player2card0').src = '/cards/back-blue-75-3.png';
          document.getElementById('player2card1').src = '/cards/back-blue-75-3.png';
          document.getElementById('player2card2').src = '/cards/back-blue-75-3.png';
          document.getElementById('player2card3').src = '/cards/back-blue-75-3.png';
          document.getElementById('player2card4').src = '/cards/back-blue-75-3.png';

          document.getElementById('player3card0').src = '/cards/back-blue-75-3.png';
          document.getElementById('player3card1').src = '/cards/back-blue-75-3.png';
          document.getElementById('player3card2').src = '/cards/back-blue-75-3.png';
          document.getElementById('player3card3').src = '/cards/back-blue-75-3.png';
          document.getElementById('player3card4').src = '/cards/back-blue-75-3.png';

          document.getElementById('player4card0').src = '/cards/back-blue-75-3.png';
          document.getElementById('player4card1').src = '/cards/back-blue-75-3.png';
          document.getElementById('player4card2').src = '/cards/back-blue-75-3.png';
          document.getElementById('player4card3').src = '/cards/back-blue-75-3.png';
          document.getElementById('player4card4').src = '/cards/back-blue-75-3.png';

          document.getElementById('player5card0').src = '/cards/back-blue-75-3.png';
          document.getElementById('player5card1').src = '/cards/back-blue-75-3.png';
          document.getElementById('player5card2').src = '/cards/back-blue-75-3.png';
          document.getElementById('player5card3').src = '/cards/back-blue-75-3.png';
          document.getElementById('player5card4').src = '/cards/back-blue-75-3.png';

          gameDirections.innerHTML = 'time for another hand!';
          //location.reload(); // XXX should not need this?
        } else if (nextState.state === 3) {
          gameDirections.innerHTML = 'who won?';
          //location.reload(); // XXX should not need this?
        }
        gGameState = nextState;
      } 
      else {
        // gGameState.state is unchanged.. although.. other fields in the state structure might be changed..
        document.getElementById('player0msg').innerHTML = ' hi '+gUsername;

        if (nextState.players[p1].playing < 0)  {
          document.getElementById('player1msg').innerHTML = nextState.players[p1].username + ' is logged out';
        } else if (nextState.players[p1].playing < 1) {
          document.getElementById('player1msg').innerHTML = nextState.players[p1].username + ' is NOT playing';
        } else if (nextState.players[p1].playing < 2) {
          document.getElementById('player1msg').innerHTML = nextState.players[p1].username + ' is playing!';
        }

        if (nextState.players[p2].playing < 0)  {
          document.getElementById('player2msg').innerHTML = nextState.players[p2].username + ' is logged out';
        } else if (nextState.players[p2].playing < 1) {
          document.getElementById('player2msg').innerHTML = nextState.players[p2].username + ' is NOT playing';
        } else if (nextState.players[p2].playing < 2) {
          document.getElementById('player2msg').innerHTML = nextState.players[p2].username + ' is playing!';
        }

        if (nextState.players[p3].playing < 0)  {
          document.getElementById('player3msg').innerHTML = nextState.players[p3].username + ' is logged out';
        } else if (nextState.players[p3].playing < 1) {
          document.getElementById('player3msg').innerHTML = nextState.players[p3].username + ' is NOT playing';
        } else if (nextState.players[p3].playing < 2) {
          document.getElementById('player3msg').innerHTML = nextState.players[p3].username + ' is playing!';
        }

        if (nextState.players[p4].playing < 0)  {
          document.getElementById('player4msg').innerHTML = nextState.players[p4].username + ' is logged out';
        } else if (nextState.players[p4].playing < 1) {
          document.getElementById('player4msg').innerHTML = nextState.players[p4].username + ' is NOT playing';
        } else if (nextState.players[p4].playing < 2) {
          document.getElementById('player4msg').innerHTML = nextState.players[p4].username + ' is playing!';
        }

        if (nextState.players[p5].playing < 0)  {
          document.getElementById('player5msg').innerHTML = nextState.players[p5].username + ' is logged out';
        } else if (nextState.players[p5].playing < 1) {
          document.getElementById('player5msg').innerHTML = nextState.players[p5].username + ' is NOT playing';
        } else if (nextState.players[p5].playing < 2) {
          document.getElementById('player5msg').innerHTML = nextState.players[p5].username + ' is playing!';
        }
      }
    }
  };
  xhr.send();
}

function joinGame(buttonObj) {
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
      if (buttonObj.value === 'Join Next Hand') {
        buttonObj.value = 'leave game'
      } else {
        buttonObj.value = 'Join Next Hand';
      }
    }
  };
  xhr.send();
  alert(buttonObj.value);
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

  // Should set up long polling or regular setInterval style polling to get the gamestate from the server
  gGamestateTimer = setInterval(getGamestate,1000*0.5); // just poll the server every 1/2 seconds for the gameState
}

window.onload =initMultiplayer;
