define(
['konva'],

function(Konva){
	function Ball() {this.init(); }
	Ball.prototype = {
		collCoeff: 0.7,
		frict: 0.0004,
		init:function(){},
		create: function(x, y, radius, color, vx, vy, world){
			
			this.x = x; this.y = y;
			this.vx = vx; this.vy = vy;
			this.radius = radius;

			this.circle = new Konva.Circle({
			  radius: world.scale * radius,
			  fill: color,
			  stroke: 'black',
			  strokeWidth: 5,
			  x: x,
			  y: y
			});
			this.circle.on('click', this.onclick(world));
	
			world.layer.add(this.circle);
		},
		onclick: function(world){
			
			var that = this;
			var world = world;
			return function(evt){
				that.vy = 0.2*(that.y - world.screenToWorld(evt.evt.y, true))/that.radius;
				that.vx = 0.2*(that.x - world.screenToWorld(evt.evt.x, false))/that.radius;
			}
		},
		step: function(world){
			this.vy += world.g;
			
			this.y += this.vy; this.x += this.vx;
			if(this.y - this.radius < 0) {
				this.vy = -this.vy*this.collCoeff;
				if(this.vy < -2*world.g) this.vy = 0;
				this.vx += (this.vx>0)?-this.frict:this.frict;
				if(Math.abs(this.vx) < 2*this.frict) this.vx = 0;
				this.y = 2*this.radius-this.y;
			}
			if(this.x - this.radius < 0) {
				this.vx = -this.vx*this.collCoeff;
				
				this.x = 2*this.radius-this.x;
			}
			if(this.x + this.radius > world.worldWidth){
				this.vx = -this.vx*this.collCoeff;
				this.x = 2*world.worldWidth-this.x-2*this.radius;
			}
			
			this.updateXY(world);
		},
		updateXY: function(world){
			this.circle.x(world.worldToScreen(this.x, false));
			this.circle.y(world.worldToScreen(this.y, true));
		}
	}
	return Ball;
}
);
