var foo = function(p) {
    // if you need to use p5 in your Class instances you
    // can pass it to your class constructor
    console.log("aModule instantiated");
};

foo.prototype.bar = function() {
    console.log("baah...")
}


// Tell the module what to return/export
module.exports = foo;
