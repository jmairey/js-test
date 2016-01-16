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
          var player0;
          var player1;
          var player2;
          var player3;
          var player4;
          var player5;

          for (i = 0; i < nextState.players.length; i++) {
            //console.log('gGameState.players[',i,']=',gGameState.players[i]);
            if (nextState.players[i].playing >  0) {
              if (!player0) {
                player0 = nextState.players[i];
              } else if (!player1) {
                player1 = nextState.players[i];
              } else if (!player2) {
                player2 = nextState.players[i];
              } else if (!player3) {
                player3 = nextState.players[i];
              } else if (!player4) {
                player4 = nextState.players[i];
              } else if (!player5) {
                player5 = nextState.players[i];
              }
            }
          }

          //gameDirections.innerHTML = 'the server knows who won...';

          if (player0 && player1) {

            var p0Result = player0.result;
            var p1Result = player1.result;

            if (p0Result.handType === p1Result.handType) {
              if (p0Result.handRank === p1Result.handRank) {
                if (p0Result.handRank2 === p1Result.handRank2) {
                  gameDirections.innerHTML = player0.username+' splits the pot with '+player1.username+': '+resultText(p0Result);
                }
                else if (p0Result.handRank2 > p1Result.handRank2) {
                  gameDirections.innerHTML = player0.username+' takes the pot with '+resultText(p0Result);
                }
                else if (p0Result.handRank2 < p1Result.handRank2) {
                  gameDirections.innerHTML = player1.username+' takes the pot with '+resultText(p1Result);
                }
              } else if (p0Result.handRank > p1Result.handRank) {
                gameDirections.innerHTML = player0.username+' takes the pot with '+resultText(p0Result);
              } else if (p0Result.handRank < p1Result.handRank) {
                gameDirections.innerHTML = player1.username+' takes the pot with '+resultText(p1Result);
              }
            } else if (p0Result.handType > p1Result.handType) {
              gameDirections.innerHTML = player0.username+' takes the pot with '+resultText(p0Result);
            } else if (p0Result.handType < p1Result.handType) {
              gameDirections.innerHTML = player1.username+' takes the pot with '+resultText(p1Result);
            }
          } else if (player0) {
            gameDirections.innerHTML = player0.username+' is only player left playing so they take the pot!';
          } else {
            gameDirections.innerHTML = 'all players left before hand is over, house takes the pot?';
          }

          //location.reload(); // XXX should not need this?
        }
        gGameState = nextState;
      } 
      else {
        // gGameState.state is unchanged.. although.. other fields in the state structure might be changed..

        document.getElementById('player0msg').innerHTML = ' hi '+gUsername+' you have $'+nextState.players[p0].wallet;

        //if (nextState.players[p1].playing !== gGameState.players[p1].playing) { 
          if (nextState.players[p1].playing < 0)  {
            document.getElementById('player1msg').innerHTML = nextState.players[p1].username + ' is logged out';
          } else if (nextState.players[p1].playing < 1) {
            document.getElementById('player1msg').innerHTML = nextState.players[p1].username + ' has NOT joined the hand';
          } else if (nextState.players[p1].playing < 2) {
            document.getElementById('player1msg').innerHTML = nextState.players[p1].username + ' has asked to join the hand!';
          }
          //gGameState.players[p1].playing = nextState.players[p1].playing;
        //}

        if (nextState.players[p2].playing < 0)  {
          document.getElementById('player2msg').innerHTML = nextState.players[p2].username + ' is logged out';
        } else if (nextState.players[p2].playing < 1) {
          document.getElementById('player2msg').innerHTML = nextState.players[p2].username + ' has NOT joined the hand';
        } else if (nextState.players[p2].playing < 2) {
          document.getElementById('player2msg').innerHTML = nextState.players[p2].username + ' has asked to join the hand...';
        }

        if (nextState.players[p3].playing < 0)  {
          document.getElementById('player3msg').innerHTML = nextState.players[p3].username + ' is logged out';
        } else if (nextState.players[p3].playing < 1) {
          document.getElementById('player3msg').innerHTML = nextState.players[p3].username + ' has NOT asked to join the hand';
        } else if (nextState.players[p3].playing < 2) {
          document.getElementById('player3msg').innerHTML = nextState.players[p3].username + ' has asked to join the hand...';
        }

        if (nextState.players[p4].playing < 0)  {
          document.getElementById('player4msg').innerHTML = nextState.players[p4].username + ' is logged out';
        } else if (nextState.players[p4].playing < 1) {
          document.getElementById('player4msg').innerHTML = nextState.players[p4].username + ' has NOT asked to join the hand'; 
        } else if (nextState.players[p4].playing < 2) {
          document.getElementById('player4msg').innerHTML = nextState.players[p4].username + ' has asked to join the hand...';
        }

        if (nextState.players[p5].playing < 0)  {
          document.getElementById('player5msg').innerHTML = nextState.players[p5].username + ' is logged out';
        } else if (nextState.players[p5].playing < 1) {
          document.getElementById('player5msg').innerHTML = nextState.players[p5].username + ' has NOT asked to join the hand';
        } else if (nextState.players[p5].playing < 2) {
          document.getElementById('player5msg').innerHTML = nextState.players[p5].username + ' has asked to join the hand...';
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
      /*
      if (buttonObj.value === 'Join Next Hand') {
        buttonObj.value = 'leave game'
      } else {
        buttonObj.value = 'Join Next Hand';
      }
      */
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
