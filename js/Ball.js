define(
['konva'],

function(Konva){
	function Ball() {this.init(); }
	Ball.prototype = {
		collCoeff: 0.7,
		frict: 0.0004,
		init:function(){this.block=false;},
		create: function(x, y, radius, color, vx, vy, world){
			this.world = world;
			this.x = x; this.y = y;
			this.vx = vx; this.vy = vy;
			this.radius = radius;
			this.color = color;
			this.varray = [];
			this.vn = 100;
			this.maxV = 0.00001;
			for(var i = 0; i < this.vn; i++){
				this.varray[i] = 0.00001;
			}
			this.vcursor = 0;
		},
		punch: function(x, y){
			
			this.vy = 0.2*(this.y - y)/this.radius;
			this.vx = 0.2*(this.x -x)/this.radius;
			
		},
		step: function(world){
			if (this.block) return;
			
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
			this.vcursor++;
			if(this.vcursor>=this.vn) this.vcursor = 0;	
			var v = Math.sqrt(this.vx*this.vx+this.vy*this.vy);
			this.varray[this.vcursor] = v;
			this.maxV = Math.max(this.maxV,v);
		},
		draw: function(ctx){
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.strokeStyle = 'black';
			ctx.lineWidth = 4;
			ctx.arc(this.world.worldToScreen(this.x), this.world.worldToScreen(this.y, true)
			, this.world.worldToScreen(this.radius), 0, 2*Math.PI);
			
			ctx.fill();
			ctx.stroke();
			
			ctx.beginPath();

			var strokeColor = "#000000";
			try {
				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.color);
				var r = parseInt(result[1], 16);
				var	g = parseInt(result[2], 16);
				var	b = parseInt(result[3], 16);
				strokeColor = 'rgba(' + r + ', ' + g + ', ' + b + ', 0.2)';
			} catch (e) {
				console.error(e);
			}

			ctx.strokeStyle = strokeColor;

			ctx.lineWidth = 2;
			
			var x0 = 0;
			var y0 = this.world.height/2;
			var step = this.world.width/(this.vn-2);
			var x = x0;
			
			ctx.moveTo(x0, y0);
			var i = this.vcursor+1;
			if(i >= this.vn) i=0;
			ctx.moveTo(x, y0+this.world.height*0.3*this.varray[i]/this.maxV)
			i++;x += step;
			var mult = this.world.height*0.3/this.maxV;
			while( i != this.vcursor){
				
				ctx.lineTo(x, y0-mult*this.varray[i]);
				x += step;
				if(x > this.world.width) {
					x = 0;
					ctx.moveTo(x, y0);
				}
				i++;
				if(i >= this.vn) i=0;
			}
			ctx.stroke();
		},
		click: function(x, y){
			var d  = Math.sqrt((this.x-x)*(this.x-x)+(this.y-y)*(this.y-y));
			if(d < this.radius){
				this.punch(x, y);
			}
		}
	}
	return Ball;
}
);
