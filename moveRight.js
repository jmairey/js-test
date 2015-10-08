
function moveCardRight(img,incr){

  var imgOffsetLeft = img.offsetLeft;
  var imgWidth    = img.offsetWidth;
  var imgOffsetRight = imgOffsetLeft + imgWidth;

  var smallCardsOffsetLeft = gSmallCards.offsetLeft;
  var smallCardsOffsetWidth = gSmallCards.offsetWidth;
  var smallCardsOffsetRight = smallCardsOffsetLeft + smallCardsOffsetWidth;

  //console.log('img       offsetRight:',imgOffsetRight);
  //console.log('container offsetRight:',smallCardsOffsetRight);

  var left = parseInt(img.style.left);

  if (imgOffsetRight < smallCardsOffsetRight - incr) {
      left += incr;
      img.style.left = left + 'px';
  } else {
    /*console.log('movement right halted')*/;
  }
}
