var circle = function(p) {
    // if you need to use p5 in your Class instances you
    // can pass it to your class constructor
    this.p5 = p;
    console.log("circle instantiated");
};

circle.prototype.draw = function() {
    var p = this.p5; // avoid repetition of this.p5
    p.ellipse(p.width/2, p.height/2, p.height * 0.75, p.height * 0.75);
}


// Tell the module what to return/export
module.exports = circle;
