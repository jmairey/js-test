
// a comment

/*

    another comment
*/
'use strict'

function sayHello () {
    console.log('hello world');
}
function sayBye () {
    console.log('bye world');
}

function gFoo () {
    //var colors = require('colors');
    var gColors = require('colors/safe');

    var gColorList = [ 
          'red'
        , 'green'
        , 'blue'
        , 'trap'
        , 'rainbow'
        , 'inverse'
        , 'foo'
        , 'bar'
    ]

    sayHello();

    console.time('colors');
    for (var i = 0; i < gColorList.length; i = i+1) {
        var c = gColorList[i];
        if (c === 'red') {
    //        console.log(gColors.red.bgBlack(c));
            console.log(gColors.white.bgRed(c));
        }
        else if (c === 'green') {
            console.log(gColors.green(c));
        }
        else if (c === 'blue') {
            console.log(gColors.blue(c));
            debugger;
        }
        else if (c === 'trap') {
            console.log(gColors.trap(c));
        }
        else if (c === 'rainbow') {
            console.log(gColors.rainbow(c));
        }
        else if (c === 'inverse') {
            console.log(gColors.inverse(c));
        }
        else {
            console.log(c);
        }

    }

    console.log('%cThis will be formatted with large, blue text',"color: blue; font-size: large");


    console.timeEnd('colors');

    sayBye();
}

gFoo();

