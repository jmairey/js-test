
var gGameState = {
    state: -1,
    pot: 0,
    wallet: 100,
};
var gDeckData;
var gCardsLeftInDeck=52;

var gHand0 = [];
var gHand1 = [];

var gDiscards = [];

var gDeck = [
 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12,
13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
52,53,
];

gCardValueIndex = 0;
gCardSuitIndex = 1;
gCardNameIndex = 2;
gCardFilenameIndex = 3;

gPrefix = '../cardimages/small/75/';
gSuffix = '-75.png';
gDeckData = [

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
  var cardIndex = Math.floor(Math.random()*gCardsLeftInDeck);

  if (cardIndex === gCardsLeftInDeck) {
    hand.push(52); // joker. should never happen
  } else {
    hand.push(gDeck.splice(cardIndex,1)[0]);
    gCardsLeftInDeck -= 1;
  }

  //console.log('cardIndex = ', cardIndex);
  //console.log('hand = ', hand);
}

function discardHand(hand) {
  if (hand && hand.length === 5) {
    gDiscards.push(hand[0],hand[1],hand[2],hand[3],hand[4]);
    hand.pop(); 
    hand.pop(); 
    hand.pop(); 
    hand.pop(); 
    hand.pop();
  }
}

function returnDiscards() {
  var i;
  for (i = 0; i < gDiscards.length; i++) {
    gDeck.splice(0,0,gDiscards[i]); // can't just push, want them ahead of the jokers
    gCardsLeftInDeck += 1;
  }
  gDiscards = [];


  gDeck.sort(indexCompare);
}

function cardCompare(a,b) {
  return gDeckData[a][0] - gDeckData[b][0];
}

function deal(hand0, hand1) {
  //console.log("gDeck = ",gDeck);
  var i;
  for (i = 0; i < 5; i++) {
    drawCard(hand0);
    drawCard(hand1);
  }

  hand0.sort(cardCompare);
  hand1.sort(cardCompare);

  //console.log(hand0);
  //console.log(hand1);

  //console.log("gDeck = ",gDeck);
}
