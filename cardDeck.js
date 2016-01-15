//
// this file is loaded by both the server for multiplayer games and the browser
// for single player games. obviously the single player games could run on 
// a server too but.. why not just do it all on the client device and 
// experiment with trying to share some code between node server and browser client

// this is the object that holds the current state of the game
var gGameState = {
  state: -1,
  pot: 0,

  cardsLeftInDeck:52,

  // indexes into the (read-only) gDeckData array. 
  // this is really the model of the card deck. as the game progresses, "cards" move from here
  // into each player[i].hand, then into gGameState.discards, then back here.
  deck: [
   0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
  39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
  52,53,
  ],

  discards: [], // will hold indices taken from players[i].hand

  // maximum of six players (for now) in a 'game'
  // players[i].hand = []; // will hold indices taken out of gDeck
  players: [],  // maps to the file users.json for multiplayer. initialized in singleplayer
};

// also could have used an array of objects rather than array of arrays
// just keeping it simple for now.
var gCardValueIndex = 0;
var gCardSuitIndex = 1;
var gCardNameIndex = 2;
var gCardFilenameIndex = 3;

// this data should be read-only (does not need to be in gGameState). 
// the gGameState.deck array indexes into the read-only gDeckData array.
// and represents the movement of cards from gGameState.deck to hands to discard and 
// back into the deck. shuffling and dealing is simulated by choosing a random
// element/index/card from gGameState.deck and putting it into one of six hands.
var gPrefix = '/cards/';
var gSuffix = '-75.png';
var gDeckData = [

[13, 'clubs',    'Ace of Clubs',     gPrefix+'clubs-a'+gSuffix ],
[ 1, 'clubs',    'Two of Clubs',     gPrefix+'clubs-2'+gSuffix ],
[ 2, 'clubs',    'Three of Clubs',   gPrefix+'clubs-3'+gSuffix ],
[ 3, 'clubs',    'Four of Clubs',    gPrefix+'clubs-4'+gSuffix ],
[ 4, 'clubs',    'Five of Clubs',    gPrefix+'clubs-5'+gSuffix ],
[ 5, 'clubs',    'Six of Clubs',     gPrefix+'clubs-6'+gSuffix ],
[ 6, 'clubs',    'Seven of Clubs',   gPrefix+'clubs-7'+gSuffix ],
[ 7, 'clubs',    'Eight of Clubs',   gPrefix+'clubs-8'+gSuffix ],
[ 8, 'clubs',    'Nine of Clubs',    gPrefix+'clubs-9'+gSuffix ],
[ 9, 'clubs',    'Ten of Clubs',     gPrefix+'clubs-10'+gSuffix],
[10, 'clubs',    'Jack of Clubs',    gPrefix+'clubs-j'+gSuffix ],
[11, 'clubs',    'Queen of Clubs',   gPrefix+'clubs-q'+gSuffix ],
[12, 'clubs',    'King of Clubs',    gPrefix+'clubs-k'+gSuffix ],

[13, 'diamonds', 'Ace of Diamonds',  gPrefix+'diamonds-a'+gSuffix ],
[ 1, 'diamonds', 'Two of Diamonds',  gPrefix+'diamonds-2'+gSuffix ],
[ 2, 'diamonds', 'Three of Diamonds',gPrefix+'diamonds-3'+gSuffix ],
[ 3, 'diamonds', 'Four of Diamonds', gPrefix+'diamonds-4'+gSuffix ],
[ 4, 'diamonds', 'Five of Diamonds', gPrefix+'diamonds-5'+gSuffix ],
[ 5, 'diamonds', 'Six of Diamonds',  gPrefix+'diamonds-6'+gSuffix ],
[ 6, 'diamonds', 'Seven of Diamonds',gPrefix+'diamonds-7'+gSuffix ],
[ 7, 'diamonds', 'Eight of Diamonds',gPrefix+'diamonds-8'+gSuffix ],
[ 8, 'diamonds', 'Nine of Diamonds', gPrefix+'diamonds-9'+gSuffix ],
[ 9, 'diamonds', 'Ten of Diamonds',  gPrefix+'diamonds-10'+gSuffix],
[10, 'diamonds', 'Jack of Diamonds', gPrefix+'diamonds-j'+gSuffix ],
[11, 'diamonds', 'Queen of Diamonds',gPrefix+'diamonds-q'+gSuffix ],
[12, 'diamonds', 'King of Diamonds', gPrefix+'diamonds-k'+gSuffix ],

[13, 'hearts',   'Ace of Hearts',    gPrefix+'hearts-a'+gSuffix ],
[ 1, 'hearts',   'Two of Hearts',    gPrefix+'hearts-2'+gSuffix ],
[ 2, 'hearts',   'Three of Hearts',  gPrefix+'hearts-3'+gSuffix ],
[ 3, 'hearts',   'Four of Hearts',   gPrefix+'hearts-4'+gSuffix ],
[ 4, 'hearts',   'Five of Hearts',   gPrefix+'hearts-5'+gSuffix ],
[ 5, 'hearts',   'Six of Hearts',    gPrefix+'hearts-6'+gSuffix ],
[ 6, 'hearts',   'Seven of Hearts',  gPrefix+'hearts-7'+gSuffix ],
[ 7, 'hearts',   'Eight of Hearts',  gPrefix+'hearts-8'+gSuffix ],
[ 8, 'hearts',   'Nine of Hearts',   gPrefix+'hearts-9'+gSuffix ],
[ 9, 'hearts',   'Ten of Hearts',    gPrefix+'hearts-10'+gSuffix],
[10, 'hearts',   'Jack of Hearts',   gPrefix+'hearts-j'+gSuffix ],
[11, 'hearts',   'Queen of Hearts',  gPrefix+'hearts-q'+gSuffix ],
[12, 'hearts',   'King of Hearts',   gPrefix+'hearts-k'+gSuffix ],

[13, 'spades',   'Ace of Spades',    gPrefix+'spades-a'+gSuffix ],
[ 1, 'spades',   'Two of Spades',    gPrefix+'spades-2'+gSuffix ],
[ 2, 'spades',   'Three of Spades',  gPrefix+'spades-3'+gSuffix ],
[ 3, 'spades',   'Four of Spades',   gPrefix+'spades-4'+gSuffix ],
[ 4, 'spades',   'Five of Spades',   gPrefix+'spades-5'+gSuffix ],
[ 5, 'spades',   'Six of Spades',    gPrefix+'spades-6'+gSuffix ],
[ 6, 'spades',   'Seven of Spades',  gPrefix+'spades-7'+gSuffix ],
[ 7, 'spades',   'Eight of Spades',  gPrefix+'spades-8'+gSuffix ],
[ 8, 'spades',   'Nine of Spades',   gPrefix+'spades-9'+gSuffix ],
[ 9, 'spades',   'Ten of Spades',    gPrefix+'spades-10'+gSuffix],
[10, 'spades',   'Jack of Spades',   gPrefix+'spades-j'+gSuffix ],
[11, 'spades',   'Queen of Spades',  gPrefix+'spades-q'+gSuffix ],
[12, 'spades',   'King of Spades',   gPrefix+'spades-k'+gSuffix ],

[-1, 'joker',    'joker-r',          gPrefix+'joker-b'+gSuffix ],
[-1, 'joker',    'joker-b',          gPrefix+'joker-b'+gSuffix ],

];

function drawCard(hand) {
  var cardIndex = Math.floor(Math.random()*gGameState.cardsLeftInDeck);

  if (cardIndex === gGameState.cardsLeftInDeck) {
    hand.push(52); // joker. should never happen
  } else {
    hand.push(gGameState.deck.splice(cardIndex,1)[0]);
    gGameState.cardsLeftInDeck -= 1;
  }

  //console.log('cardIndex = ', cardIndex);
  //console.log('hand = ', hand);
}

function discardHand(hand) {
  if (hand && hand.length === 5) {
    gGameState.discards.push(hand[0],hand[1],hand[2],hand[3],hand[4]);
    hand.pop(); 
    hand.pop(); 
    hand.pop(); 
    hand.pop(); 
    hand.pop();
  }
}

function returnDiscards() {
  var i;
  for (i = 0; i < gGameState.discards.length; i++) {
    gGameState.deck.splice(0,0,gGameState.discards[i]); // can't just push, want them ahead of the jokers
    gGameState.cardsLeftInDeck += 1;
  }
  gGameState.discards = [];

  function indexCompare(a,b) {
    return a - b;
  }

  gGameState.deck.sort(indexCompare);
}

function cardCompare(a,b) {
  return gDeckData[a][0] - gDeckData[b][0];
}

function dealHands(numCards,numHands,hand0, hand1, hand2, hand3, hand4, hand5) {
  //console.log("gGameState.deck = ",gGameState.deck);
  var i;
  for (i = 0; i < numCards; i++) {
    // tempted to use switch statement with fall through... but won't..
    if (numHands > 0) {
      drawCard(hand0);
    }
    if (numHands > 1) {
      drawCard(hand1);
    }
    if (numHands > 2) {
      drawCard(hand2);
    }
    if (numHands > 3) {
      drawCard(hand3);
    }
    if (numHands > 4) {
      drawCard(hand4);
    }
    if (numHands > 5) {
      drawCard(hand4);
    }
  }

  if (numHands > 0) {
    hand0.sort(cardCompare);
  }

  if (numHands > 1) {
    hand1.sort(cardCompare);
  }

  if (numHands > 2) {
    hand2.sort(cardCompare);
  }

  if (numHands > 3) {
    hand3.sort(cardCompare);
  }

  if (numHands > 4) {
    hand4.sort(cardCompare);
  }

  if (numHands > 5) {
    hand5.sort(cardCompare);
  }

  //console.log(hand0);
  //console.log(hand1);

  //console.log("gGameState.deck = ",gGameState.deck);
}

function resultText(result) {
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
  } else if (result.handType === 0) {
    resultText = 'a single high card: ' + gDeckData[result.card0][2];
  } else {
    resultText = 'results are not in yet..';
  }

  return resultText;
}

// XXX should probably pass in the result object. I think we are creating one here
function analyzeHand(hand){

  // could assume the hand is sorted..
  hand.sort(cardCompare);

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

// we do this for node on the server side. on the browser side we can 'var exports = undefined' to ignore this code..
if (exports !== undefined) {  // exports will be defined in node, for the server..
  exports.gGameState = gGameState;
  exports.discardHand = discardHand;
  exports.returnDiscards = returnDiscards;
  exports.dealHands = dealHands;
  exports.analyzeHand = analyzeHand;
  exports.resultText = resultText;
}
