require.config({

	paths: {
		konva: "lib/konva"
	}
});

require([
	'World', 'SonicServer'
], function(
	World, SonicServer
) {
	var ACCENT_COLORS = ["#004d40", "#006064", "#00695c", "#00796b", "#00838f", "#00897b", "#0091ea", "#009688", "#0097a7", "#00acc1", "#00bcd4", "#01579b", "#0277bd", "#0288d1", "#039be5", "#03a9f4", "#056f00", "#0a7e07", "#0a8f08", "#0d5302", "#1a237e", "#259b24", "#283593", "#2a36b1", "#303f9f", "#304ffe", "#311b92", "#33691e", "#37474f", "#3949ab", "#3b50ce", "#3d5afe", "#3f51b5", "#4527a0", "#455a64", "#455ede", "#4a148c", "#4d69ff", "#4d73ff", "#4e342e", "#4e6cef", "#512da8", "#536dfe", "#546e7a", "#558b2f", "#5677fc", "#5c6bc0", "#5d4037", "#5e35b1", "#607d8b", "#6200ea", "#651fff", "#673ab7", "#6889ff", "#6a1b9a", "#6d4c41", "#78909c", "#795548", "#7986cb", "#7b1fa2", "#7c4dff", "#7e57c2", "#880e4f", "#8d6e63", "#8e24aa", "#9575cd", "#9c27b0", "#aa00ff", "#ab47bc", "#ad1457", "#b0120a", "#ba68c8", "#bf360c", "#c2185b", "#c41411", "#c51162", "#d01716", "#d500f9", "#d81b60", "#d84315", "#dd191d", "#dd2c00", "#e00032", "#e040fb", "#e51c23", "#e64a19", "#e65100", "#e91e63", "#ef6c00", "#f4511e", "#f50057", "#ff2d6f", "#ff3d00", "#ff4081", "#ff5177", "#ff5722", "#ff6f00", "#ff8f00", "#ffa000"];

	var width = window.innerWidth;
	var height = window.innerHeight;

	var FPS = 60;

	var world = new World();
	world.create(width, height, 3, FPS);

	// ULTRASONIC SERVER
	var ALPHABET = ';1234567890abcdef';
	var sonicServer = new SonicServer({alphabet: ALPHABET});
	sonicServer.start();
	sonicServer.on('message', function(message) {
		// radius;color
		// 12;00796b
		var messageParts = message.split(';');
		var radius = messageParts[0] / 30;
		var color = "#" + messageParts[1];
		console.log(message);
		world.addBall(3 * width * Math.random() / height, 4, radius, 0, 0, color);
	});

	function keyDown(e) {
		if (e.keyCode == 32) {
			world.playPause();
			e.preventDefault();
		} else if (e.keyCode == 81) {
			world.playStep();
		} else if (e.keyCode == 13) {
			var colorId = parseInt(Math.random() * ACCENT_COLORS.length);
			world.addBall(3 * width * Math.random() / height, 4, Math.random() * 0.3 + 0.05, 0, 0, ACCENT_COLORS[colorId]);
		}
	}

	world.playPause();

	document.addEventListener('keydown', keyDown, false);
});
