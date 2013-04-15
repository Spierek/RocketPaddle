ig.module('game.gamestate.play')
.requires('impact.game', 'impact.font',
		'game.gamestate.level-setup','game.gamestate.gameover','game.gamestate.win',
		'game.entities.paddle', 'game.entities.ball', 'game.entities.block', 'game.entities.count',
		'game.levels.level', 'plugins.impact-storage')
.defines(function(){
Play = ig.Game.extend({
// data
	font: 		new ig.Font( 'media/04b03.font.png' ),
	fontLarge:	new ig.Font( 'media/04b032.font.png' ),
	storage: 	new ig.Storage(),

	tutorialTimer: null,
	tutorialAlpha: 0,
	gravity: 	-200,

	scoreText: 	null,

// methods
	init: function() {
		this.loadLevel(LevelLevel); 
		// standard controls
		if( ig.ua.mobile ) {
   			// All other mobile devices
    		ig.input.bindTouch( '#canvas', 	'rocket' );
    		ig.input.initAccelerometer();
		}
		else {
    		// Desktop browsers
    		ig.input.bind(ig.KEY.MOUSE1, 	'rocket');
			ig.input.bind(ig.KEY.P, 		'pause');
		}
		// stuff
		this.paddle = this.getEntitiesByType(EntityPaddle)[0];

		this.lives = 3;
		this.level = this.storage.get('level');
		this.score = 0;
		this.scoreText = "0000"
		this.storage.set('score', 0);
		this.storage.set('blockCount', 0);
		this.fontLarge.letterSpacing = 2;

		this.levelbg = 0;
		this.paused = false;
		
		this.tutorialTimer = new ig.Timer();

		this._reset(this.storage.get('level'));
	},
	update: function() {
		this._pauseCheck();
		if (this.paused) return;		
		this.parent();
	},
	draw: function() {
		this.parent();
		// bg
		this._levelBGColor();
		// tutorial
		if (this.level === 1) {
			this._tutorialText();
		}
		//paddle
		this.paddle.draw();
		// hud
		this._fuelBarAnim();
		
		this.fontLarge.draw(this.lives, 52, 228, ig.Font.ALIGN.LEFT);
		this.fontLarge.draw(this.level - 1, 100, 228, ig.Font.ALIGN.CENTER);
		this.fontLarge.draw(this.scoreText, 133, 228, ig.Font.ALIGN.LEFT);
		
		// pause
		if (this.paused) {
			// background rect
			ig.system.context.fillStyle = "rgba(0, 0, 0, 0.5)";
			ig.system.context.beginPath();
			ig.system.context.rect(16, 210, 368, 30);
			ig.system.context.closePath();
			ig.system.context.fill();

			this.font.draw('paused', ig.system.width / 2, ig.system.height / 2 - 10, ig.Font.ALIGN.CENTER)
		}

		// countdown
		if (this.getEntitiesByType(EntityCount)[0]) {
			this.getEntitiesByType(EntityCount)[0].draw();
		}
	},
	loadLevel: function( level ) {
	    this.parent( level );
	    
	    // Enable the pre-rendered background mode for all 
	    // mobile devices
	    if( ig.ua.mobile ) {
	        for( var i = 0; i < this.backgroundMaps.length; i++ ) {
	            this.backgroundMaps[i].preRender = true;
	        }
	    }
	},

	// sets up the next stage
	_reset: function(level) {
		this.level = level;
		if (level === 0) {
			ig.resetGame();
			return;
		}
		else if (level > ig.LevelSetup.length) {
			ig.system.setGame(Win);
			return;
		}
		// kill 'em all
		this._killAllOf(EntityBall);
		this._killAllOf(EntityBlock);
		this._killAllOf(EntityCount);

		if (level === 2) {
			this.font.alpha = 1;
			ig.system.setGame(Menu);
		}

		// resetting
		this.paddle.pos.y = 8;
		this.paddle.fuel = this.paddle.fuelMax;
		this._populateLevel(this.level);

		if (level !== 1) {
			this._activateCount();
		}
	},
	_activateCount: function () {
		count = this.spawnEntity(EntityCount, 8, 90, {
			onDeath: this._onCountDeath.bind(this),
			paddlePos: {x: this.paddle.pos.x, y: this.paddle.pos.y}
		});

		// removing binds during the countdown
		if( ig.ua.mobile ) {
    		ig.input.bindTouch( '#canvas', 	null );
		}
		else {
    		ig.input.unbind(ig.KEY.MOUSE1);
			ig.input.unbind(ig.KEY.P);
		}
	},
	// sets up new blocks on every stage
	_populateLevel: function(level) {
		// cleaning
		this._killAllOf(EntityBlock);
		this.blockCount = 0;
		// preparations
		var onDeath = this._onBlockDeath.bind(this);
		var blockSize = {x: EntityBlock.prototype.size.x, y: EntityBlock.prototype.size.y};
		var blockMap = ig.LevelSetup[level - 1].blocks;
		var off = {x: 24, y: 190 - blockMap.length * blockSize.y};
		// block spawning
		for (var i = 0; i < blockMap.length; ++i) {
			for (var j = 0; j < blockMap[i].length; ++j) {
				var getType = blockMap[i][j];
				if (getType) {
					var block = this.spawnEntity(EntityBlock, 
						j*(blockSize.x + 2) + off.x,
						i*(blockSize.y + 2) + off.y, {
							getType: getType,
							onDeath: onDeath,
						});
					++this.blockCount;
				}
			}
		}
		// choose bg color
		this.levelbg = Math.floor(Math.random()*4);
	},
	// removes all entities of a certain type
	_killAllOf: function(entityType) {
		var entities = this.getEntitiesByType(entityType);

		for (var i = 0; i < entities.length; ++i) {
			entities[i].kill();
		}
	},
	// handles ball death and decrements player lives
	_onBallDeath: function(ball) {
		ball.kill();
		this.lives -= 1;
		if (this.lives < 1) {
			ig.system.setGame(GameOver);
		}
		else {
			this._activateCount();
		}
	},
	// handles block death and increments score / levels
	_onBlockDeath: function(block) {
		--this.blockCount;
		if (this.blockCount === 0) {
			this.lives += 1;
			// achievements
			if (this.level === 1)
				( new Clay.Achievement( { id: 'rp1' } ) ).award();
			else if (this.level === 2)
				( new Clay.Achievement( { id: 'rp2' } ) ).award();
			else if (this.level === 7)
				( new Clay.Achievement( { id: 'rp3' } ) ).award();
			else if (this.level === 12)
				( new Clay.Achievement( { id: 'rp4' } ) ).award();
			else if (this.level === 18)
				( new Clay.Achievement( { id: 'rp10' } ) ).award();
			// reset
			this._reset(this.level + 1);
		}

		this.score += 5 + block.extraScore;
		this.storage.set('score', this.score);
		if (block.extraScore !== 0)
			this.storage.set('blockCount', this.storage.get('blockCount') + 1);

		var blockCount = this.storage.get('blockCount');
		if (blockCount > 50)
			( new Clay.Achievement( { id: 'rp8' } ) ).award();
		if (blockCount > 150)
			( new Clay.Achievement( { id: 'rp9' } ) ).award();

		if (this.score < 10)			this.scoreText = '000' + this.score;
		else if (this.score < 100)		this.scoreText = '00' + this.score;
		else if (this.score < 1000)		this.scoreText = '0' + this.score;
		else							this.scoreText = this.score;
	},
	// handles countdown death and spawns balls
	_onCountDeath: function(count) {
		if (this.level !== 1)
			this._addBall(true);
		if( ig.ua.mobile ) {
   			// All other mobile devices
    		ig.input.bindTouch( '#canvas', 	'rocket' );
		}
		else {
    		// Desktop browsers
    		ig.input.bind(ig.KEY.MOUSE1, 	'rocket');
			ig.input.bind(ig.KEY.P, 		'pause');
		}
	},
	_addBall: function(active) {
		var ball = this.spawnEntity(EntityBall, this.paddle.pos.x + this.paddle.size.x/2, 30, {
			active: active,
			onDeath: this._onBallDeath.bind(this)
		});
	},
	_fuelBarAnim: function() {
		var used = this.paddle.fuel / this.paddle.fuelMax;
		// left
		ig.system.context.fillStyle = "rgb(224, 230, 236)";
		ig.system.context.beginPath();
		ig.system.context.rect(16, 436, 184*(1-used), 8);
		ig.system.context.closePath();
		ig.system.context.fill();
		// right
		ig.system.context.fillStyle = "rgb(224, 230, 236)";
		ig.system.context.beginPath();
		ig.system.context.rect(200+186*used, 436, 184*(1-used), 8);
		ig.system.context.closePath();
		ig.system.context.fill();
	},
	// randomizes background color in every new stage
	_levelBGColor: function() {
		switch(this.levelbg) {
			case 0:
				ig.system.context.fillStyle = "rgba(55, 17, 17, 0.2)";	break;
			case 1:
				ig.system.context.fillStyle = "rgba(13, 17, 46, 0.2)";	break;
			case 2:
				ig.system.context.fillStyle = "rgba(21, 55, 17, 0.2)";	break;
			case 3:
				ig.system.context.fillStyle = "rgba(55, 17, 42, 0.2)";	break;
			case 4:
				ig.system.context.fillStyle = "rgba(55, 51, 17, 0.2)";	break;
			default:
				ig.system.context.fillStyle = "rgba(55, 17, 17, 0.2)";	break;
				break;
		}
		ig.system.context.beginPath();
		ig.system.context.rect(16, 16, 368, 416);
		ig.system.context.closePath();
		ig.system.context.fill();
	},
	// displays the tutorial instructions and handles fading
	_tutorialText: function() {
		// alpha
		if (ig.input.state('rocket')) {
			this.tutorialTimer.reset();
			this.tutorialAlpha = -1;
		}
		else if (!ig.input.state('rocket') && this.paddle.pos.y < 30) {
			this.tutorialTimer.reset();
			this.tutorialAlpha = 1;
		}
		if (this.tutorialTimer.delta() < 1) {
			this.font.alpha += this.tutorialAlpha * this.tutorialTimer.tick() * 2;
		}
		if (this.font.alpha < 0) 		this.font.alpha = 0;
		else if (this.font.alpha > 1) 	this.font.alpha = 1;
		
		// texts
		this.font.draw('Hi! Welcome to RocketPaddle!', ig.system.width / 2, 50, ig.Font.ALIGN.CENTER);
		this.font.draw('This is a block ->\n\n' +
						'You can break them with a ball\n' +
						'(you will get one on the next level).', ig.system.width / 2, 70, ig.Font.ALIGN.CENTER);
		if( ig.ua.mobile ) {
			this.font.draw('However, there is a better way!\n' +
							'Just hold the Left Mouse Button to\n' +
							'break them with your ROCKETPADDLE.\n' +
							'This also gives you MORE POINTS!', ig.system.width / 2, 125, ig.Font.ALIGN.CENTER);
		}
		else {
			this.font.draw('However, there is a better way!\n' +
							'Just tap and hold the screen to\n' +
							'break them with your ROCKETPADDLE.\n' +
							'This also gives you MORE POINTS!', ig.system.width / 2, 125, ig.Font.ALIGN.CENTER);
		}
	    
    	this.font.draw('You can propel as long as you\n' +
						'have some fuel in the bar below.\n\n' +
						"Break the blocks to continue.\n", ig.system.width / 2, 178, ig.Font.ALIGN.CENTER);
	    
	},
	_pauseCheck: function() {
		if (ig.input.pressed('pause')) {
			this.paused = !this.paused;
		}
	}
});
});