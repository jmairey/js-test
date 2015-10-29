
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
