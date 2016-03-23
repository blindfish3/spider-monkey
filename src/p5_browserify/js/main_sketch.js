var b = {},
    Circle = require('./_circle');

//TODO: find out how to reference root/_lib without relative paths
b.log = require('../../_lib/_log');

// Stop p5js polluting the global namespace by using instance mode
// assigning to a *single* global variable using Browserify's 'global'
// ...in this context an alias to window
//TODO: consider the wisdom of overwriting the p5 variable
global.P$ = new p5(function (p) {

    var c;

    // p.preload = function () {
    //
    // };

    p.setup = function () {
        p.createCanvas(600, 400);

        c = new Circle(this);
    };

    p.draw = function () {
        p.background('#c10');
        c.draw();
    };

    // p.mousePressed = function () {
    //
    // };

    // p.mouseReleased = function () {
    //
    // };

}, "sketch01");
