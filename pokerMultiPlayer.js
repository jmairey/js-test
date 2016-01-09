//'use strict';

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
      console.log('joinGame: result = ' + responseObject.result);
      messageText.value = 'joined game!';
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
