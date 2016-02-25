var circle = function() {
    console.log("circle instantiated");
};

circle.prototype.draw = function() {
    P$.ellipse(P$.width/2, P$.height/2, P$.height * 0.75, P$.height * 0.75);
}

// Tell the module what to return/export
module.exports = circle;
