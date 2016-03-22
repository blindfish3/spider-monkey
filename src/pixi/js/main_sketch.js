var animate = require('./_animate');

var renderer = PIXI.autoDetectRenderer(450, 325);
// add the renderer view element to the DOM
document.getElementById('sketch01').appendChild(renderer.view);

var stage = new PIXI.Container();

//preload images
PIXI.loader
    .add('blindfish.png')
    // run setup
    .load(setup);


function setup() {

    var texture = PIXI.Texture.fromImage('blindfish.png');
    var fish = new PIXI.Sprite(texture);

    fish.position.x = renderer.width;
    fish.position.y = renderer.height/2 - fish.height/2;


    //-- Some variables need to be global
    //TODO: investigate a more elegant way of achieving this - i.e. is it possible
    // to make a var global in our Browserified code without attaching it to window?
    var vars = {};
    vars.renderer = renderer;
    vars.stage = stage;
    vars.fish = fish;
    global.blindfish = vars;


    stage.addChild(fish);
    requestAnimationFrame(animate);
}
