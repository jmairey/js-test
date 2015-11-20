//'use strict';

var gXHR;
//var gXHRData;
//var gURL = 'http://127.0.0.1:8081'
var gURL = 'http://jmairey-rMBP.local:8081'
//var gURL = 'http://localhost:8081'

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
    discardHand(gHand0);
    discardHand(gHand1);

    returnDiscards();

    deal(gHand0, gHand1);

    resetCardPositions();

    var gameDirectionsText = "select cards to discard then hit Call or Fold..."
    gGameState.pot = 2*5; // two players ante
    gGameState.wallet -= 5;
    gameDirectionsText += 'wallet ' + gGameState.wallet + ' pot ' + gGameState.pot;

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
        if (gHand0[0] < 52) {
          gCard0.src = gPrefix+"back-blue-75-3.png";
          gDiscards.push(gHand0[0]);
          gHand0[0] = 52;
        }
      } else if (gCurCard === gCard1) {
        //alert("discard Card 1");
        if (gHand0[1] < 52) {
          gCard1.src = gPrefix+"back-blue-75-3.png";
          gDiscards.push(gHand0[1]);
          gHand0[1] = 52;
        }
      } else if (gCurCard === gCard2) {
        //alert("discard Card 2");
        if (gHand0[2] < 52) {
          gCard2.src = gPrefix+"back-blue-75-3.png";
          gDiscards.push(gHand0[2]);
          gHand0[2] = 52;
        }
      } else if (gCurCard === gCard3) {
        //alert("discard Card 3");
        if (gHand0[3] < 52) {
          gCard3.src = gPrefix+"back-blue-75-3.png";
          gDiscards.push(gHand0[3]);
          gHand0[3] = 52;
        }
      } else if (gCurCard === gCard4) {
        //alert("discard Card 4");
        if (gHand0[4] < 52) {
          gCard4.src = gPrefix+"back-blue-75-3.png";
          gDiscards.push(gHand0[4]);
          gHand0[4] = 52;
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
      if (gHand0[i] === 52) {
        cardIndex = Math.floor(Math.random()*gCardsLeftInDeck);

        if (cardIndex !== gCardsLeftInDeck) {
          gHand0[i] = gDeck.splice(cardIndex,1)[0];
          gCardsLeftInDeck -= 1;
        }
      }
    }

    gHand0.sort(cardCompare);

    resetCardPositions();

    gGameState.state = 2;

    //console.log('deck = ', gDeck);
    //console.log('hand0 = ', gHand0);
    //console.log('hand1 = ', gHand1);

    // should assert that ghand0, ghand1 and gDeck make a complete deck?
  }
}

function analyzeHand(hand){
  // we assume the hand is sorted..

  var result = { 
    handType:  -1, 
    handRank:  -1,
    handRank2: -1, // rank of the low pair in a full house or two pair
    card0: -1,
    card1: -1,
    card2: -1,
    card3: -1,
    card4: -1,
  };


  // using javascript property of variables being undefined by default which is 'falsy'
  var pair1; // starts out undefined...
  var pair2;
  var pair3;
  var pair4;

  var twopair1;
  var twopair2;
  var twopair3;

  var triple1;
  var triple2;
  var triple3;

  var flush;

  var straight;


  // have at least a single high card
  result.handType = 0;
  result.handRank = gDeckData[hand[4]][0];
  result.card0 = hand[4];

  // look for pairs first, then build bottom up from there
  if (gDeckData[hand[0]][0] === gDeckData[hand[1]][0]){
    pair1 = true;
    result.handType = 1;
    result.handRank = gDeckData[hand[0]][0];
    result.card0 = hand[0];
    result.card1 = hand[1];
  }

  if (gDeckData[hand[1]][0] === gDeckData[hand[2]][0]){
    pair2 = true;
    result.handType = 1;
    result.handRank = gDeckData[hand[1]][0];
    result.card0 = hand[1];
    result.card1 = hand[2];
  }

  if (gDeckData[hand[2]][0] === gDeckData[hand[3]][0]){
    pair3 = true;
    result.handType = 1;
    result.handRank = gDeckData[hand[2]][0];
    result.card0 = hand[2];
    result.card1 = hand[3];
  }

  if (gDeckData[hand[3]][0] === gDeckData[hand[4]][0]){
    pair4 = true;
    result.handType = 1;
    result.handRank = gDeckData[hand[3]][0];
    result.card0 = hand[3];
    result.card1 = hand[4];
  }

  // two pairs ?
  if (pair1 && pair3) {
    result.handType = 2;
    result.handRank = gDeckData[hand[2]][0];
    result.handRank2 = gDeckData[hand[0]][0];
    result.card0 = hand[0];
    result.card1 = hand[1];
    result.card2 = hand[2];
    result.card3 = hand[3];
  }

  if (pair2 && pair4) {
    result.handType = 2;
    result.handRank = gDeckData[hand[3]][0];
    result.handRank2 = gDeckData[hand[1]][0];
    result.card0 = hand[1];
    result.card1 = hand[2];
    result.card2 = hand[3];
    result.card3 = hand[4];
  }
  
  if (pair1 && pair4) {
    result.handType = 2;
    result.handRank = gDeckData[hand[3]][0];
    result.handRank2 = gDeckData[hand[0]][0];
    result.card0 = hand[0];
    result.card1 = hand[1];
    result.card2 = hand[3];
    result.card3 = hand[4];
  }

  // three of a kind ?
  if (pair1 && pair2) {
    triple1 = true;
    result.handType = 3;
    result.handRank = gDeckData[hand[0]][0];
    result.card0 = hand[0];
    result.card1 = hand[1];
    result.card2 = hand[2];
  }
  if (pair2 && pair3) {
    triple2 = true;
    result.handType = 3;
    result.handRank = gDeckData[hand[1]][0];
    result.card0 = hand[1];
    result.card1 = hand[2];
    result.card2 = hand[3];
  }
  if (pair3 && pair4) {
    triple3 = true;
    result.handType = 3;
    result.handRank = gDeckData[hand[2]][0];
    result.card0 = hand[2];
    result.card1 = hand[3];
    result.card2 = hand[4];
  }

  // full house ?
  if (pair1 && triple3){
    result.handType = 6;
    result.handRank = gDeckData[hand[2]][0];
    result.handRank2 = gDeckData[hand[0]][0];
    result.card0 = hand[0]; 
    result.card1 = hand[1];
    result.card2 = hand[2];
    result.card3 = hand[3];
    result.card4 = hand[4];
  }
  if (triple1 && pair4){
    result.handType = 6;
    result.handRank = gDeckData[hand[0]][0];
    result.handRank2 = gDeckData[hand[3]][0];
    result.card0 = hand[0]; 
    result.card1 = hand[1];
    result.card2 = hand[2];
    result.card3 = hand[3];
    result.card4 = hand[4];
  }

  // straight ?
  if (gDeckData[hand[0]][0] === gDeckData[hand[1]][0] - 1 &&
      gDeckData[hand[1]][0] === gDeckData[hand[2]][0] - 1 &&
      gDeckData[hand[2]][0] === gDeckData[hand[3]][0] - 1 &&
      gDeckData[hand[3]][0] === gDeckData[hand[4]][0] - 1) {
    straight = true;
    result.handType = 4;
    result.handRank = gDeckData[hand[4]][0];
    result.handRank2 = gDeckData[hand[3]][0];
    result.card0 = hand[0];  
    result.card1 = hand[1];
    result.card2 = hand[2];
    result.card3 = hand[3];
    result.card4 = hand[4];
  }
  // ace low straight
  if (gDeckData[hand[0]][0] === 13 &&
      gDeckData[hand[1]][0] ===  1 &&
      gDeckData[hand[2]][0] ===  2 &&
      gDeckData[hand[3]][0] ===  3 &&
      gDeckData[hand[4]][0] ===  4) {
    straight = true;
    result.handType = 4;
    result.handRank = gDeckData[hand[0]][0];
    result.handRank2 = gDeckData[hand[4]][0];
    result.card0 = hand[0]; 
    result.card1 = hand[1];
    result.card2 = hand[2];
    result.card3 = hand[3];
    result.card4 = hand[4];
  }

  // flush ?
  if (gDeckData[hand[0]][1] === gDeckData[hand[1]][1] &&
      gDeckData[hand[1]][1] === gDeckData[hand[2]][1] &&
      gDeckData[hand[2]][1] === gDeckData[hand[3]][1] &&
      gDeckData[hand[3]][1] === gDeckData[hand[4]][1]) {
    flush = true;
    result.handType = 5;
    result.handRank = gDeckData[hand[4]][0];
    result.card0 = hand[0];   // start with highest value card?
    result.card1 = hand[1];
    result.card2 = hand[2];
    result.card3 = hand[3];
    result.card4 = hand[4];
  }


  // straight flush ?
  if (straight && flush) {
    result.handType = 8;
    result.handRank = gDeckData[hand[1]][0];
  }
  // four of a kind ? (use else-if since we checked for straight flush)
  else if (pair1 && pair2 && pair3) { 
    result.handType = 7;
    result.handRank = gDeckData[hand[0]][0];
    result.card0 = hand[0];
    result.card1 = hand[1];
    result.card2 = hand[2];
    result.card3 = hand[3];
  } else if (pair2 && pair3 && pair4) {
    result.handType = 7;
    result.handRank = gDeckData[hand[1]][0];
    result.card0 = hand[1];
    result.card1 = hand[2];
    result.card2 = hand[3];
    result.card3 = hand[4];
  }

  return result;

}

function setResultHTML(result,resultElement) {
  var resultText;

  if (result.handType === 8) {
    resultText = 'straightflush';
  } else if (result.handType === 7) {
    resultText = 'four of a kind';
  } else if (result.handType === 6) {
    resultText = 'full house';
  } else if (result.handType === 5) {
    resultText = 'flush';
  } else if (result.handType === 4) {
    resultText = 'straight';
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
    resultText = 'single high card: ' + gDeckData[result.card0][2];
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
  if (gHand0) {
    img.src = gDeckData[gHand0[0]][3];
  }

  img = document.getElementById('card1');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gHand0) {
    img.src = gDeckData[gHand0[1]][3];
  }

  img = document.getElementById('card2');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gHand0) {
    img.src = gDeckData[gHand0[2]][3];
  }

  img = document.getElementById('card3');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gHand0) {
    img.src = gDeckData[gHand0[3]][3];
  }

  img = document.getElementById('card4');
  img.style.position= 'relative'; 
  img.style.left = '0px'; 
  img.style.bottom = '0px'; 
  if (gHand0) {
    img.src = gDeckData[gHand0[4]][3];
  }

  img = document.getElementById('player1card0');
  //img.src = "../cardimages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gHand1[0]][3];

  img = document.getElementById('player1card1');
  //img.src = "../cardimages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gHand1[1]][3];

  img = document.getElementById('player1card2');
  //img.src = "../cardimages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gHand1[2]][3];

  img = document.getElementById('player1card3');
  //img.src = "../cardimages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gHand1[3]][3];

  img = document.getElementById('player1card4');
  //img.src = "../cardimages/small/75/back-blue-75-3.png";
  img.src = gDeckData[gHand1[4]][3];

  setOrToggleCurrentCard(gCurCard);
}

function callGame(buttonObj){
  //alert(buttonObj.type);
  //alert(buttonObj.value);
  //var response = prompt('really ready to start game?', 'yes');
  //alert(response);

  if (gGameState.state === 2) {
    resetCardPositions();

    var player0Result = analyzeHand(gHand0);
    setResultHTML(player0Result,document.getElementById('player0Result'));

    var computerResult = analyzeHand(gHand1);
    setResultHTML(computerResult,document.getElementById('computerResult'));

    var gameDirections = document.getElementById("gameDirections");
    if (player0Result.handType === computerResult.handType) {
      if (player0Result.handRank === computerResult.handRank) {
        if (player0Result.handRank2 === computerResult.handRank2) {
          gameDirectionText = 'split the pot...';
          gGameState.wallet += gGameState.pot/2;
          gGameState.pot = 0; 
        } else if (player0Result.handRank2 > computerResult.handRank2) {
          gameDirectionText = 'you won with ' + document.getElementById('player0Result').innerText;
          gGameState.wallet += gGameState.pot;
          gGameState.pot = 0; 
        } else if (player0Result.handRank2 < computerResult.handRank2) {
          gameDirectionText = 'you lost against ' + document.getElementById('computerResult').innerText;
          gGameState.pot = 0; 
        } else {
          gameDirectionText = '!!! need to fix a bug in our code to figure out who won...';
        }
      } else if (player0Result.handRank > computerResult.handRank) {
        gameDirectionText = 'you won with ' + document.getElementById('player0Result').innerText;
        gGameState.wallet += gGameState.pot;
        gGameState.pot = 0; 
      } else if (player0Result.handRank < computerResult.handRank) {
        gameDirectionText = 'you lost against ' + document.getElementById('computerResult').innerText;
        gGameState.pot = 0; 
      } else {
          gameDirectionText = '!! need to fix a bug in our code to figure out who won...';
      }
    } else if (player0Result.handType > computerResult.handType) {
      gameDirectionText = 'you won with ' + document.getElementById('player0Result').innerText;
      gGameState.wallet += gGameState.pot;
      gGameState.pot = 0; 
    } else if (player0Result.handType < computerResult.handType) {
      gameDirectionText = 'you lost against ' + document.getElementById('computerResult').innerText;
      gGameState.pot = 0; 
    } else {
        gameDirectionText = '! need to fix a bug in our code to figure out who won...';
    }

    var gXHR = new XMLHttpRequest();
    gXHR.open("POST", "/poker/call");
    gXHR.setRequestHeader('Content-Type', 'application/json'); // seems needed
    gXHR.onreadystatechange = function() {
      if (gXHR.readyState===4 && gXHR.status===200){
        var jsonObj = JSON.parse(gXHR.responseText);
        //console.log(gXHR.responseText);
        console.log(' response from server:',jsonObj);
        gGameState.wallet = jsonObj.wallet;
        gameDirections.innerHTML = gameDirectionText + jsonObj.andSomeOtherData;
      } else {
        gameDirections.innerHTML = '...';
      }
    };
    var someData = { wallet: gGameState.wallet };
    var jsonString = JSON.stringify(someData);
    gXHR.send(jsonString);


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

  gXHR = new XMLHttpRequest();

  gXHR.onreadystatechange = function() {
    if (gXHR.readyState === 4 && gXHR.status === 200) {
      //console.log(gXHR.responseText);

      var jsonObj = JSON.parse(gXHR.responseText);
      //console.log(jsonObj);

      var playerIndex = Math.floor(Math.random()*jsonObj.players.length);
      var user = jsonObj.players[playerIndex];

      //console.log(user);

      var gameDirections = document.getElementById("gameDirections");
      var gameDirectionsText = user.name 
                             + ', please kindly ' 
                             + gameDirections.innerHTML;
      gameDirections.innerHTML = gameDirectionsText;

    } else {
      console.log('readyState = ',gXHR.readyState);
      console.log('status = ',gXHR.status);
    }
  };

  gXHR.open('GET', gURL+'/list_user', true);

  //gXHR.setRequestHeader('Content-Type', 'application/json'); // not necessary?

  gXHR.send();

}

window.onload =init;
