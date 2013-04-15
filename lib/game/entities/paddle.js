// fix the goddamn mouseout problem

ig.module('game.entities.paddle')
.requires('impact.entity')
.defines(function(){
// the mighty paddle
	EntityPaddle = ig.Entity.extend({
	// basic data
		animSheet: 	new ig.AnimationSheet('media/paddle.png', 40, 12),
		size: 			{x: 40, y: 12},
		flip: 			false,
		// weltmeister box
		_wmDrawBox: 	true,
		_wmBoxColor: 	'rgba(255,0,0,0.7)',
		// physics
		jump: 			200,
		keySpeed: 		200,
		friction: 		{x: 0, y: 0},
		// rocket fuel
		fuel: 			0,
		fuelMax: 		100,
		fuelTimer: 		null,
		fuelDelay: 		1.5,
		// collision info
		type: 			ig.Entity.TYPE.A,
		checkAgainst: 	ig.Entity.TYPE.NONE,
		collides: 		ig.Entity.COLLIDES.ACTIVE,
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);

			this.addAnim('idle', 1, [0]);
			this.addAnim('rocket', 1, [0]);

			this.fuel = this.fuelMax;
			this.fuelTimer = new ig.Timer();
		},
		update: function (){
			// moving
			if ( ig.ua.mobile ) {
	   			// All other mobile devices
	    		this.pos.x += ig.input.accel.x;
	    		if (this.pos.x < 8) 
	    			this.pos.x = 8;
	    		else if (this.pos.x > ig.system.width - this.size.x - 8)
	    			this.pos.x = ig.system.width - this.size.x - 8;
			}
			else if (window.chrome){
				this.pos.x = paddlePosition.x;
			}
			else {
				this.pos.x = ig.input.mouse.x.limit(28, ig.system.width - 28);
				this.pos.x -= 20;
			}
			// jumping
			if (ig.input.state('rocket') && this.fuel > 0){
				this.vel.y = 450;
				this.fuel -= 1;
				this.fuelTimer.reset();
				ig.game.spawnEntity(EntityPaddleFire, this.pos.x + 4, this.pos.y - 3);
				ig.game.spawnEntity(EntityPaddleFire, this.pos.x + 34, this.pos.y - 3);
			}
			else {
				if (this.fuel < this.fuelMax && this.fuelTimer.delta() > this.fuelDelay) {
					this.fuel += 2;
				}
				this.accel.y = -1500;
			}
			// set animation
			if (this.vel.y < 0) {
				this.currentAnim = this.anims.rocket;
			} else {
				this.currentAnim = this.anims.idle;
			}
			this.parent();
		},
		handleMovementTrace: function(res) {
			this.parent(res);
		},
		kill: function() {
			this.parent();
		},
		draw: function(){
			this.parent();
		},
	});
// paddle fire particle emitters
	EntityPaddleFire = ig.Entity.extend({
	// basic data
		particles: 	1,
		callBack: 	null,
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			for (var i = 0; i < this.particles; i++) {
				ig.game.spawnEntity(EntityPaddleFireParticle, x, y);
			}
			this.kill();
		},
		update: function () {
			this.parent();
		}
	});
// paddle fire particles
	EntityPaddleFireParticle = ig.Entity.extend({
	// basic data
		size: 		{x: 1, y: 1},
		maxVel: 	{x: 160, y: 200},
		lifetime: 	0.4,
		fadetime: 	1,
		vel: 		{x: 20, y: 30},
		animSheet: 	new ig.AnimationSheet('media/particle.png', 1, 1),
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);

			var frameID = Math.round(Math.random()*4);
			this.addAnim('idle', 0.2, [frameID]);
			this.idleTimer = new ig.Timer();

			this.pos.x += Math.random()*5 - 2;
			this.vel.x = (Math.random()*2 - 1) * this.vel.x;
		},
		update: function () {
			if (this.idleTimer.delta() > this.lifetime) {
				this.kill();
				return;
			}
			this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
			this.parent();
		}
	});
});