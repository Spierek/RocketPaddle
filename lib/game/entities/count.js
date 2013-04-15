ig.module('game.entities.count').requires('impact.entity').defines(function() {
	EntityCount = ig.Entity.extend({
	// basic data
		size: 			{x: 184, y: 39},
		animSheet: 		new ig.AnimationSheet('media/countdown.png', 184, 39),

		alphaTimer: 	null,
		gravityFactor: 	0,
		paddlePos: 		null,
	// methods
		init: function(x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('counting', 0.3, [0,0,0,1,2,3], true);
			this.alphaTimer = new ig.Timer();
			this.anims.counting.alpha = 0;

			//console.log (this.paddlePos);
		},
		update: function(paddle) {
			this.parent();
			// linear paddle move code
			///

			// leave this?
			if(this.currentAnim.loopCount > 0) {
				this.kill();
				this.onDeath(this);
			}
		},
		draw: function() {
			if (this.alphaTimer.delta() < 0.2)				this.anims.counting.alpha = 0 + this.alphaTimer.delta() * 5;
			else if (this.alphaTimer.delta() > 1.5)			this.anims.counting.alpha = 1 - (this.alphaTimer.delta() -  1.5) * 5;

			if (this.anims.counting.alpha > 1) 				this.anims.counting.alpha = 1;
			else if (this.anims.counting.alpha < 0) 		this.anims.counting.alpha = 0;

			this.parent();
		}
	});
});