//'use strict';

var gPlayer0Cards;
var gCard0;
var gCard1;
var gCard2;
var gCard3;
var gCard4;

var gCurCard;

function redCardBack(buttonObj) {
  alert(buttonObj.type);
}

function anteAndDealHands(buttonObj) {
  //alert(buttonObj.value);

  if (gGameState.state === -1) {
    discardHand(gGameState.players[0].hand);
    discardHand(gGameState.players[1].hand);

    returnDiscards();

    dealHands(5,2,gGameState.players[0].hand, gGameState.players[1].hand);

    resetCardPositions();

    var gameDirectionsText = "select cards to discard then hit Call or Fold..."
    gGameState.pot = 2*5; // two players ante
    gGameState.players[0].wallet -= 5;
    gGameState.players[1].wallet -= 5;
    gameDirectionsText += 'wallet ' + gGameState.players[0].wallet + ' pot ' + gGameState.pot;

    gGameState.state = 2;

    var gameDirections = document.getElementById("gameDirections");
    gameDirections.innerHTML = gameDirectionsText;
    document.getElementById('player0Result').innerHTML = "your hand analysis "
    document.getElementById('computerResult').innerHTML = "computer hand analysis "

  }
}

function discardCurrentCard(buttonObj) {
  //alert(buttonObj.value);
  if (gGameState.state === 2 || gGameState.state === 1) {
    if (gCurCard) {
      if        (gCurCard === gCard0) {
        //alert("discard Card 0");
        if (gGameState.players[0].hand[0] < 52) {
          gCard0.src = gPrefix+"back-blue-75-3.png";
          gGameState.discards.push(gGameState.players[0].hand[0]);
          gGameState.players[0].hand[0] = 52;
        }
      } else if (gCurCard === gCard1) {
        //alert("discard Card 1");
        if (gGameState.players[0].hand[1] < 52) {
          gCard1.src = gPrefix+"back-blue-75-3.png";
          gGameState.discards.push(gGameState.players[0].hand[1]);
          gGameState.players[0].hand[1] = 52;
        }
      } else if (gCurCard === gCard2) {
        //alert("discard Card 2");
        if (gGameState.players[0].hand[2] < 52) {
          gCard2.src = gPrefix+"back-blue-75-3.png";
          gGameState.discards.push(gGameState.players[0].hand[2]);
          gGameState.players[0].hand[2] = 52;
        }
      } else if (gCurCard === gCard3) {
        //alert("discard Card 3");
        if (gGameState.players[0].hand[3] < 52) {
          gCard3.src = gPrefix+"back-blue-75-3.png";
          gGameState.discards.push(gGameState.players[0].hand[3]);
          gGameState.players[0].hand[3] = 52;
        }
      } else if (gCurCard === gCard4) {
        //alert("discard Card 4");
        if (gGameState.players[0].hand[4] < 52) {
          gCard4.src = gPrefix+"back-blue-75-3.png";
          gGameState.discards.push(gGameState.players[0].hand[4]);
          gGameState.players[0].hand[4] = 52;
        }
      }
    }
    gGameState.state = 1;
  }
}

function doneDiscard(buttonObj) {
  //alert(buttonObj.value);

  if (gGameState.state === 1) {
    returnDiscards();

    var i;
    var cardIndex;
    for (i = 0; i < 5; i++) {
      if (gGameState.players[0].hand[i] === 52) {
        cardIndex = Math.floor(Math.random()*gGameState.cardsLeftInDeck);

        if (cardIndex !== gGameState.cardsLeftInDeck) {
          gGameState.players[0].hand[i] = gGameState.deck.splice(cardIndex,1)[0];
          gGameState.cardsLeftInDeck -= 1;
        }
      }
    }

    gGameState.players[0].hand.sort(cardCompare);

    resetCardPositions();

    gGameState.state = 2;

    //console.log('deck = ', gGameState.deck);
    //console.log('hand0 = ', gGameState.players[0].hand);
    //console.log('hand1 = ', gGameState.players[1].hand);

    // should assert that ghand0, ghand1 and gGameState.deck make a complete deck?
  }
}

function setResultHTML(result,resultElement) {
  var resultText;

  if (result.handType === 8) {
    resultText = 'a straightflush';
  } else if (result.handType === 7) {
    resultText = 'four of a kind';
  } else if (result.handType === 6) {
    resultText = 'a full house';
  } else if (result.handType === 5) {
    resultText = 'a flush';
  } else if (result.handType === 4) {
    resultText = 'a straight';
  } else if (result.handType === 3) {
    resultText = 'three of a kind: ' + gDeckData[result.card0][2] +
                                ', ' + gDeckData[result.card1][2] +
                                ', ' + gDeckData[result.card2][2];
  } else if (result.handType === 2) {
    resultText = 'two pair : ' + gDeckData[result.card0][2] +
                          ', ' + gDeckData[result.card1][2] +
                          ', ' + gDeckData[result.card2][2] +
                          ', ' + gDeckData[result.card3][2];
  } else if (result.handType === 1) {
    resultText = 'one pair: ' + gDeckData[result.card0][2] + 
                         ', ' + gDeckData[result.card1][2];
  } else {
    resultText = 'a single high card: ' + gDeckData[result.card0][2];
  }

  resultElement.innerHTML = resultText;
}

function foldHand(buttonObj) {
  //alert(buttonObj.value);
  callGame(buttonObj)
}

function handleCard0Click(){
  setOrToggleCurrentCard(gCard0);
}

function handleCard1Click(){
  setOrToggleCurrentCard(gCard1);
}

function handleCard2Click(){
  setOrToggleCurrentCard(gCard2);
}

function handleCard3Click(){
  setOrToggleCurrentCard(gCard3);
}

function handleCard4Click(){
  setOrToggleCurrentCard(gCard4);
}

function indexCompare(a,b) {
  return a - b;
}

function resetCardPositions() {
  var img;

  img = document.getElementById('card0');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gGameState.players[0].hand) {
    img.src = gDeckData[gGameState.players[0].hand[0]][3];
  }

  img = document.getElementById('card1');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gGameState.players[0].hand) {
    img.src = gDeckData[gGameState.players[0].hand[1]][3];
  }

  img = document.getElementById('card2');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gGameState.players[0].hand) {
    img.src = gDeckData[gGameState.players[0].hand[2]][3];
  }

  img = document.getElementById('card3');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gGameState.players[0].hand) {
    img.src = gDeckData[gGameState.players[0].hand[3]][3];
  }

  img = document.getElementById('card4');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gGameState.players[0].hand) {
    img.src = gDeckData[gGameState.players[0].hand[4]][3];
  }

  img = document.getElementById('player1card0');
  //img.src = "../cardImages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gGameState.players[1].hand[0]][3];

  img = document.getElementById('player1card1');
  //img.src = "../cardImages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gGameState.players[1].hand[1]][3];

  img = document.getElementById('player1card2');
  //img.src = "../cardImages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gGameState.players[1].hand[2]][3];

  img = document.getElementById('player1card3');
  //img.src = "../cardImages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gGameState.players[1].hand[3]][3];

  img = document.getElementById('player1card4');
  //img.src = "../cardImages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gGameState.players[1].hand[4]][3];

  setOrToggleCurrentCard(gCurCard);
}

function callGame(buttonObj){
  //alert(buttonObj.type);
  //alert(buttonObj.value);
  //var response = prompt('really ready to start game?', 'yes');
  //alert(response);

  if (gGameState.state === 2) {
    resetCardPositions();

    var player0Result = analyzeHand(gGameState.players[0].hand);
    setResultHTML(player0Result,document.getElementById('player0Result'));

    var computerResult = analyzeHand(gGameState.players[1].hand);
    setResultHTML(computerResult,document.getElementById('computerResult'));

    var gameDirections = document.getElementById("gameDirections");
    if (player0Result.handType === computerResult.handType) {
      if (player0Result.handRank === computerResult.handRank) {
        if (player0Result.handRank2 === computerResult.handRank2) {
          gameDirectionText = 'split the pot...';
          gGameState.players[0].wallet += gGameState.pot/2;
          gGameState.players[1].wallet += gGameState.pot/2;
          gGameState.pot = 0; 
        } else if (player0Result.handRank2 > computerResult.handRank2) {
          gameDirectionText = 'you won with ' + document.getElementById('player0Result').innerText;
          gGameState.players[0].wallet += gGameState.pot;
          gGameState.pot = 0; 
        } else if (player0Result.handRank2 < computerResult.handRank2) {
          gameDirectionText = 'you lost against ' + document.getElementById('computerResult').innerText;
          gGameState.players[1].wallet += gGameState.pot;
          gGameState.pot = 0; 
        } else {
          gameDirectionText = '!!! need to fix a bug in our code to figure out who won...';
        }
      } else if (player0Result.handRank > computerResult.handRank) {
        gameDirectionText = 'you won with ' + document.getElementById('player0Result').innerText;
        gGameState.players[0].wallet += gGameState.pot;
        gGameState.pot = 0; 
      } else if (player0Result.handRank < computerResult.handRank) {
        gameDirectionText = 'you lost against ' + document.getElementById('computerResult').innerText;
        gGameState.players[1].wallet += gGameState.pot;
        gGameState.pot = 0; 
      } else {
          gameDirectionText = '!! need to fix a bug in our code to figure out who won...';
      }
    } else if (player0Result.handType > computerResult.handType) {
      gameDirectionText = 'you won with ' + document.getElementById('player0Result').innerText;
      gGameState.players[0].wallet += gGameState.pot;
      gGameState.pot = 0; 
    } else if (player0Result.handType < computerResult.handType) {
      gameDirectionText = 'you lost against ' + document.getElementById('computerResult').innerText;
      gGameState.players[1].wallet += gGameState.pot;
      gGameState.pot = 0; 
    } else {
        gameDirectionText = '! need to fix a bug in our code to figure out who won...';
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/poker/singlePlayerCall");
    xhr.setRequestHeader('Content-Type', 'application/json'); // seems needed
    xhr.onreadystatechange = function() {
      if (xhr.readyState===4 && xhr.status===200){
        var jsonObj = JSON.parse(xhr.responseText);
        //console.log(xhr.responseText);
        console.log(' response from server:',jsonObj);
        gGameState.players[0].wallet = jsonObj.wallet;
        gameDirections.innerHTML = gameDirectionText + jsonObj.andSomeOtherData;
      } else {
        gameDirections.innerHTML = 'waiting on server...';
      }
    };
    var someData = { wallet: gGameState.players[0].wallet };
    var jsonString = JSON.stringify(someData);
    xhr.send(jsonString);

    gGameState.state = -1;
  }


}

function setOrToggleCurrentCard(card){
  if (gCurCard) {
    if (gCurCard !== card) {
      gCurCard.style.zIndex = 0;
      gCurCard.className="";

      gCurCard = card;
      gCurCard.style.zIndex = 1;
      gCurCard.className="curCard";
    } else {
      gCurCard.style.zIndex = 0;
      gCurCard.className="";
      gCurCard = undefined;
    }

  } else if (card) {
    gCurCard = card;
    gCurCard.style.zIndex = 1;
    gCurCard.className="curCard";
  }
}

function moveCardUp(img,incr){
  if (img) {
    var imgOffsetTop = img.offsetTop;
    var player0CardsOffsetTop = gPlayer0Cards.offsetTop;

    var bottom = parseInt(img.style.bottom);

    if (imgOffsetTop > player0CardsOffsetTop + incr) {
        bottom += incr;
        img.style.bottom = bottom + 'px';
    } else {
      /*console.log('movement up halted')*/;
    }
  }
}

function moveCardDown(img,incr){
  if (img) {
    var imgOffsetTop = img.offsetTop;
    var imgHeight    = img.offsetHeight;
    var imgOffsetBottom = imgOffsetTop + imgHeight;

    var player0CardsOffsetTop = gPlayer0Cards.offsetTop;
    var player0CardsOffsetHeight = gPlayer0Cards.offsetHeight;
    var player0CardsOffsetBottom = player0CardsOffsetTop + player0CardsOffsetHeight;

    //console.log('img       offsetBottom:',imgOffsetBottom);
    //console.log('container offsetBottom:',player0CardsOffsetBottom);

    var bottom = parseInt(img.style.bottom);

    if (imgOffsetBottom < player0CardsOffsetBottom - incr) {
        bottom -= incr;
        img.style.bottom = bottom + 'px';
    } else {
      /*console.log('movement down halted')*/;
    }
  }
}

function moveCardLeft(img,incr){
  if (img) {
    var imgOffsetLeft = img.offsetLeft;
    var player0CardsOffsetLeft = gPlayer0Cards.offsetLeft;

    //var imgClientLeft = img.clientLeft;
    //var player0CardsClientLeft = gPlayer0Cards.clientLeft;
    //console.log('img       offsetLeft:',imgOffsetLeft);
    //console.log('container offsetLeft:',player0CardsOffsetLeft);
    //console.log('img       clientLeft:',imgClientLeft);
    //console.log('container clientLeft:',player0CardsClientLeft);

    var left = parseInt(img.style.left);

    if (imgOffsetLeft > player0CardsOffsetLeft+incr) {
        left -= incr;
        //console.log('img left:',left);
        img.style.left = left + 'px';
    } else {
      /*console.log('movement left halted')*/;
    }
  }
} 
function moveCardRight(img,incr){

  if (img) {
    var imgOffsetLeft = img.offsetLeft;
    var imgWidth    = img.offsetWidth;
    var imgOffsetRight = imgOffsetLeft + imgWidth;

    var player0CardsOffsetLeft = gPlayer0Cards.offsetLeft;
    var player0CardsOffsetWidth = gPlayer0Cards.offsetWidth;
    var player0CardsOffsetRight = player0CardsOffsetLeft + player0CardsOffsetWidth;

    //console.log('img       offsetRight:',imgOffsetRight);
    //console.log('container offsetRight:',player0CardsOffsetRight);

    var left = parseInt(img.style.left);

    if (imgOffsetRight < player0CardsOffsetRight - incr) {
        left += incr;
        img.style.left = left + 'px';
    } else {
      /*console.log('movement right halted')*/;
    }
  }
}



function init(){

  var img;

  authenticationInit();

  gGameState.players[0] = {  
    username: 'you',
    password: 'none',
    id: 1,
    wallet: 100,
    playing: 0,
    hand: [],
  };

  gGameState.players[1] = {  
    username: 'computer one',
    password: 'none',
    id: 1,
    wallet: 100,
    playing: 0,
    hand: [],
  };

  img = document.getElementById('card0');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  gCard0 = img;

  img = document.getElementById('card1');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  gCard1 = img;

  img = document.getElementById('card2');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  gCard2 = img;

  img = document.getElementById('card3');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  gCard3 = img;

  img = document.getElementById('card4');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  gCard4 = img;

  gPlayer0Cards = document.getElementById('player0Cards');

  /*
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      //console.log(xhr.responseText);

      var jsonObj = JSON.parse(xhr.responseText);

      console.log(jsonObj);

      gGameState.players = jsonObj.players;

      var playerIndex = Math.floor(Math.random()*gGameState.players.length);
      var user = gGameState.players[playerIndex];

      user.playing = true;

      console.log(gGameState.players[playerIndex]);

      var gameDirections = document.getElementById("gameDirections");
      var gameDirectionsText = user.username 
                             + ', please kindly ' 
                             + gameDirections.innerHTML;
      gameDirections.innerHTML = gameDirectionsText;

    } else {
      console.log('readyState = ',xhr.readyState);
      console.log('status = ',xhr.status);
    }
  };

  xhr.open('GET', '/list_user', true);

  //xhr.setRequestHeader('Content-Type', 'application/json'); // not necessary?

  xhr.send();
  */


}

window.onload =init;
