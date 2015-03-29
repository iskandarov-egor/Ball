define(
['konva', 'Ball'],

function(Konva, Ball){
	function World() { this.init();}
	World.prototype = {
		default_g: -9.8,
		//worldHeight - высота экрана в метрах
		create:function(screenWidth, screenHeight, worldHeight, FPS){
			this.g = this.default_g;
			this.g /= FPS*FPS;
			this.FPS = FPS;
			this.height = screenHeight;
			this.scale = 1.0*screenHeight / worldHeight;
			var box = new Konva.Rect({
			  width: screenWidth,
			  height: screenHeight,
			  stroke: 'black',
			  strokeWidth: 5
			});
			this.layer.add(box);
			var that = this;
			var ground = new Konva.Rect({
			  width: screenWidth,
			  height: that.groundH,
			  fill: 'black',
			  y: screenHeight
			});
			this.layer.add(ground);
			
			this.worldWidth = screenWidth / this.scale;
		},
		playStep: function(){
			this.step();
			this.render();
			console.log('step');
			
		},
		worldToScreen: function(coord, is_y){
			if(is_y) return this.height - coord * this.scale;
			else return coord * this.scale;
		},
		screenToWorld: function(coord, is_y){
			if(is_y) coord = this.height - coord;
			return coord / this.scale;
		},
		init: function(){
			this.steps = 0;
			this.groundH = 100;
			this.balls = [];
			this.nballs = 0;
			var that = this;
            this.stage = new Konva.Stage({
                container: 'worldContainer',
                width: 1000,
                height: 800
            });
            this.layer = new Konva.Layer();
            this.stage.add(this.layer);
            
            
            this.playing = false;
            
            
		},
		addBall: function(x, y, radius, vx, vy, color) {
			var ball = new Ball();
            ball.create(x, y, radius, color, vx, vy, this);
            this.balls.push(ball);
            this.nballs++;
		},
		render: function(){
			this.layer.draw();
		},
		step: function () {
			for(var i = 0; i < this.nballs; i++){
				var ball = this.balls[i];
				ball.step(this);
				//console.log(ball.y);
			}
			
			this.steps++;
		},
		play: function(){
			this.playing = true;
			console.log('playing...');
			this.run;
		},
		pause: function() {
			this.playing = false;
			console.log('paused.');
		},
		playPause: function() {
			this.playing = !this.playing;
			if(this.playing) {
				console.log('running!');
				this.run();
			} else console.log('pause');
		},
		run: function (){
			var now, dt = 0;
			var last = window.performance.now();
			var stepTime = 1000/this.FPS;
			var that = this;
			function frame() {		
				now = window.performance.now();
				dt += Math.min((now - last), 1000);
				
				if(dt > stepTime){	
					while(dt > stepTime) {
						dt -= stepTime;
						that.step();
					}
					
					that.render();
					last = now;
				}
				if(that.playing)requestAnimationFrame(frame);
			}
			requestAnimationFrame(frame);
		}
	}
	return World;
}
);
