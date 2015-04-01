require.config({
   
    paths: {
        konva: "lib/konva"
    }
});

require([
    'World'
], function(
    World
) {

var width = window.innerWidth;
var height = window.innerHeight;

var FPS = 60;

var world = new World();
world.create(width, height, 3, FPS);
world.addBall(2.2, 3, 0.5, 0, 0, 'red');
world.addBall(2, 0, 0.4, 0.02*0, 0, 'yellow');
var colors = ['purple', 'lime', 'blue', 'aqua', 'orange'];
cid = 0;
function keyDown(e){
	if(e.keyCode == 32){
		world.playPause();
		e.preventDefault();
	} else if (e.keyCode == 81){
		world.playStep();
	}else if (e.keyCode == 13){
		world.addBall(3*width*Math.random()/height, 3, Math.random(), 0, 0, colors[cid]);
		cid++;
	}
}

document.addEventListener('keydown',    keyDown,    false);
});
