// Stop p5js polluting the global namespace by using instance mode.
// You can access the p5 instance - e.g. in your 'Class' definition - via the
// myp5 global (rename to taste).
var myp5 = new p5(function (p) {

    // p.preload = function () {
    //
    // };

    p.setup = function () {
        p.createCanvas(600, 400);
    };

    p.draw = function () {
        // just to shoe that something is happening
        p.background('#c10');
        p.ellipse(p.width/2, p.height/2, 200,200);
    };

    // p.mousePressed = function () {
    //
    // };

    // p.mouseReleased = function () {
    //
    // };

}, "sketch01");
