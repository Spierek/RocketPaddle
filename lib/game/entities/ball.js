ig.module('game.entities.ball') .requires('impact.entity') .defines(function(){
	EntityBall = ig.Entity.extend({
	// basic data
		animSheet: 	new ig.AnimationSheet('media/ball.png', 4, 4),
		size: 			{x: 4, y: 4},
		flip: 			false,
		// physics
		speed: 			120,
		maxVel: 		{x: 200, y: 150},
		bounciness: 	1.02,
		minBounceVelocity: 0,
		friction: 		{x: 0, y: 0},
		gravityFactor: 	0,
		// collision info
		type: 			ig.Entity.TYPE.B,
		checkAgainst: 	ig.Entity.TYPE.BOTH,
		collides: 		ig.Entity.COLLIDES.LITE,
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 0.2, [0]);

			var mod = Math.floor((Math.random()*2));
			if (mod === 0) mod = -1;
			this.vel.x = mod*(Math.random()*0.4 + 0.6) * this.speed;
			this.vel.y = (Math.random()*0.3 + 0.7) * this.speed;
		},
		update: function() {
			this.parent();

			if (this.pos.y < 10) {
				if (this.onDeath) {
					this.onDeath(this);
				}
				ig.game.spawnEntity(EntityBlockParts, this.pos.x, this.pos.y);
			}
		},
	});
// block pieces particle generators
	EntityBallPartEmitter = ig.Entity.extend({
	// basic data
		particles: 	4,
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			for (var i = 0; i < this.particles; i++) {
				ig.game.spawnEntity(EntityBallParticles, x, y);
			}
			this.kill();
			this.idleTimer = new ig.Timer();
		},
		update: function () {
			this.parent();
		},
	});
// ball pieces particles
	EntityBallParticles = ig.Entity.extend({
	// basic data
		size: 		{x: 1, y: 1},
		maxVel: 	{x: 160, y: 200},
		lifetime: 	0.4,
		fadetime: 	1,
		gravityFactor: 	0,
		vel: 		{x: 80, y: 80},
		animSheet: 	new ig.AnimationSheet('media/blockparts.png', 3, 3),
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);

			var frameID = Math.round(Math.random()*4);
			this.addAnim('idle', 0.2, [frameID]);
			this.idleTimer = new ig.Timer();

			this.pos.x += Math.random()*5 - 2;
			this.vel.x = (Math.random()*2 - 1) * this.vel.x;
			this.vel.y = (Math.random()*2 ) * this.vel.y;
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

