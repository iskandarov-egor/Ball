define(
['konva', 'Ball'],

function(Konva, Ball){
	function World() { this.init();}
	World.prototype = {
		default_g: -9.8,
		create:function(screenWidth, screenHeight, worldHeight, FPS){
			this.g = this.default_g;
			this.g /= FPS*FPS;
			this.FPS = FPS;
			this.height = screenHeight;
			this.width = screenWidth;
			this.scale = 1.0*screenHeight / worldHeight;
			this.worldHeight = worldHeight;
			this.canvas = document.createElement('canvas');
			this.canvas.width  = screenWidth;
			this.canvas.height = screenHeight;
			this.canvas.addEventListener('click', this.onclick());
			document.body.appendChild(this.canvas);
			this.ctx = this.canvas.getContext('2d');
			
			this.worldWidth = screenWidth / this.scale;
		},
		onclick: function(){
			var that = this;
			return function(e){
				var x = that.screenToWorld(e.x);
				var y = that.screenToWorld(e.y, true);
				for(var i = 0; i < that.nballs; i++){
					that.balls[i].click(x, y);
				}
			}
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
			this.balls = [];
			this.nballs = 0;
            this.playing = false;
            window.onresize = this.resize();
            
		},
		addBall: function(x, y, radius, vx, vy, color) {
			var ball = new Ball();
            ball.create(x, y, radius, color, vx, vy, this);
            this.balls.push(ball);
            this.nballs++;
		},
		resize: function(){
			
			var that = this;
			return function(){
				that.ctx.canvas.width  = window.innerWidth;
				that.ctx.canvas.height = window.innerHeight;
				that.width  = window.innerWidth;
				that.height = window.innerHeight;
				that.scale = 1.0*that.height / that.worldHeight;
				that.worldWidth = that.screenToWorld(that.width);
				
			}
		},
		render: function(){
			this.ctx.clearRect(0, 0, this.width, this.height);
			for(var i = 0; i < this.nballs; i++){
				this.balls[i].draw(this.ctx);
			}
		},
		step: function () {
			for(var i = 0; i < this.nballs; i++){
				var ball = this.balls[i];
				ball.step(this);
				this.balls[i].block = false;
			}
			
			this.steps++;
			
			for(var i = 0; i < this.nballs; i++){
				for(var j = i+1; j < this.nballs; j++)if(j != i){
					var bi = this.balls[i];
					var bj = this.balls[j];
					var dx = bi.x+bi.vx-bj.x-bj.vx;
					var dy = bi.y+bi.vy-bj.y-bj.vy;
					var d = Math.sqrt(dx*dx+dy*dy);
					if(d < bi.radius+bj.radius){
						var normx = bi.x-bj.x; var normy = bi.y-bj.y;
						var norm = Math.sqrt(normx*normx+normy*normy);
						normx /= norm; normy /= norm;
						var tanx = -normy; var tany = normx;
						var biNormV = bi.vx*normx+bi.vy*normy; var biTanV = bi.vx*tanx+bi.vy*tany;
						var bjNormV = bj.vx*normx+bj.vy*normy; var bjTanV = bj.vx*tanx+bj.vy*tany;
						bi.vx = normx*bjNormV + tanx*biTanV; bi.vy = normy*bjNormV + tany*biTanV;
						bj.vx = normx*biNormV + tanx*bjTanV; bj.vy = normy*biNormV + tany*bjTanV;
						
						//bj.block = true;
						//bi.block = true;
					}
				}
			}
			
			
				
		},
		play: function(){
			this.playing = true;
			console.log('playing...');
			this.run();
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
