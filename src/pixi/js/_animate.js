var animate = function () {

    var pos = blindfish.fish.position;
    pos.x -= 2;

    if(pos.x < 0-blindfish.fish.width *1.5) {
        pos.x = blindfish.renderer.width;
    }

    // render the stage
    blindfish.renderer.render(blindfish.stage);
    // call teh next frame
    requestAnimationFrame(animate);
}

module.exports = animate;
