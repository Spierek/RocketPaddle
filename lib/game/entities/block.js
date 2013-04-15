ig.module('game.entities.block')
.requires('impact.entity', 'game.entities.paddle', 'game.entities.ball', 'plugins.impact-storage')
.defines(function(){
// block
	EntityBlock = ig.Entity.extend({
	// basic data
		animSheet: 	new ig.AnimationSheet('media/blocks.png', 20, 6),
		size: 			{x: 20, y: 6},
		gravityFactor: 	0,
		// collision info
		type: 			ig.Entity.TYPE.B,
		checkAgainst: 	ig.Entity.TYPE.BOTH,
		collides: 		ig.Entity.COLLIDES.FIXED,
		extraScore: 	0,	
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('A', 1, [0]);
			this.addAnim('B', 1, [1]);
		},
		update: function() {
			this.parent();
			if(this.dying && this.currentAnim.loopCount > 0) {
				this.kill();
			}
		},
		collideWith: function(other) {
			if (other.type === ig.Entity.TYPE.A) {
				this.extraScore = 5;
			}

			this.die();
			ig.game.spawnEntity(EntityBlockParts, this.pos.x, this.pos.y);
		},
		die: function() {
			if (!this.dying) {
				this.dying = true;
				this.collides = ig.Entity.COLLIDES.NONE;

				if(this.onDeath) {
					this.onDeath(this);
				}
			}
		}
	});
// block pieces particle generators
	EntityBlockParts = ig.Entity.extend({
	// basic data
		particles: 	8,
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			for (var i = 0; i < this.particles; i++) {
				ig.game.spawnEntity(EntityBlockParticles, x, y);
			}
			this.kill();
			this.idleTimer = new ig.Timer();
		},
		update: function () {
			this.parent();
		}
	});
// block pieces particles
	EntityBlockParticles = ig.Entity.extend({
	// basic data
		size: 		{x: 3, y: 3},
		maxVel: 	{x: 160, y: 200},
		lifetime: 	0.4,
		fadetime: 	1,
		gravityFactor: 	0.5,
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
			this.vel.y = (Math.random()*2 - 1) * this.vel.x;
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