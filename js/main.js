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

var width = 800;
var height = 400;
var FPS = 60;

var world = new World();
world.create(width, height, 3, FPS);
world.addBall(2, 3, 0.5, 0, 0, 'red');
world.addBall(3, 2, 0.4, 0.02, 0, 'yellow');
function keyDown(e){
	if(e.keyCode == 32){
		world.playPause();
		e.preventDefault();
	} else if (e.keyCode == 81){
		world.playStep();
	}
}

document.addEventListener('keydown',    keyDown,    false);
});
