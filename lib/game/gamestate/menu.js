ig.module('game.gamestate.menu')
.requires('impact.game', 'impact.font',
		'game.gamestate.play', 'game.gamestate.about',
		'game.entities.paddle',
		'game.levels.frame', 
		'plugins.impact-storage')
.defines(function(){
Menu = ig.Game.extend({
// data
	movementX: 	null,
	movementY: 	null,
	storage: 	new ig.Storage(),

	font: 		new ig.Font( 'media/04b03.font.png' ),
	font2: 		new ig.Font( 'media/04b033.font.png' ),
	menuImg: 	new ig.Image('media/menu.png'),

	gravity: 	-200,

	// clay.io stuff
	

// methods
	init: function() {
		this.loadLevel(LevelFrame); 
		// setting up the pointer lock on WebKit (and an alternative everywhere else)
		if (window.chrome)
			setupPointerLock();
		// controls
		if( ig.ua.mobile ) {
    		ig.input.bindTouch( '#canvas', 	'rocket' );
    		ig.input.initAccelerometer();
		}
		else {
    		ig.input.bind(ig.KEY.MOUSE1, 	'rocket');
    		ig.input.bind(ig.KEY.L, 		'showBoards');
    		ig.input.bind(ig.KEY.A, 		'showAchievements');
		}
		
		this.font2.alpha = 0.3;
		this.paddle = this.spawnEntity(EntityPaddle, 80, 12);
		this.storage.initUnset('level', 0);
	},
	update: function() {
		this.parent();
		// menu options
		if (this.paddle.pos.y > 126) {
			if (this.paddle.pos.x < 40 && this.paddle.pos.y > 132) {
				ig.system.setGame(Play);
				this.storage.set('level', 1)
			}
			else if (this.paddle.pos.x >= 40 && this.paddle.pos.x < 120) {
				ig.system.setGame(Play);
				this.storage.set('level', 2)
			}
			else if (this.paddle.pos.y > 132)
				ig.system.setGame(About);
		}
		// leaderboard
		if (ig.input.pressed('showBoards')) {
			var leaderboard = new Clay.Leaderboard( { id: 1061 } );
			leaderboard.show();
		}
		if (ig.input.pressed('showAchievements')) {
			Clay.Achievement.showAll();
		}
	},
	draw: function() {
		this.parent();
		this.font2.draw('Press A to see the achievement list.\n\n' +
						'Press L to see the leaderboards.', ig.system.width / 2, 80, ig.Font.ALIGN.CENTER);
		//paddle
		this.paddle.draw();
		// hud
		this._fuelBarAnim();

		if( ig.ua.mobile ) {
	        this.font.draw('Tap and hold to choose.', ig.system.width / 2, ig.system.height - 10, ig.Font.ALIGN.CENTER);
	    }
	    else {
	    	this.font.draw('Hold LMB to choose.', ig.system.width / 2, ig.system.height - 10, ig.Font.ALIGN.CENTER);
	    }

	    // menu covers
	    this.menuImg.draw(8,106);
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
});
});

// pointer lock stuff
var paddlePosition = {x:80, y:10};
var canvas = $("#canvas").get()[0];
function setupPointerLock() {
    document.addEventListener('pointerlockchange', changeCallback, false);
    document.addEventListener('mozpointerlockchange', changeCallback, false);
    document.addEventListener('webkitpointerlockchange', changeCallback, false);

    $("#canvas").click(function () {
        var canvas = $("#canvas").get()[0];
        canvas.requestPointerLock = canvas.requestPointerLock ||
                					canvas.mozRequestPointerLock ||
              						canvas.webkitRequestPointerLock;
        canvas.requestPointerLock();
    });
};
function changeCallback(e) {
    if (document.pointerLockElement === canvas ||
            document.mozPointerLockElement === canvas ||
            document.webkitPointerLockElement === canvas) {
        document.addEventListener("mousemove", moveCallback, false);
    } else {
        document.removeEventListener("mousemove", moveCallback, false);
        paddlePosition = {x: 80, y: 10};
    }
};
function moveCallback(e) {
    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    paddlePosition.x += movementX / 1.5;

    if 		(paddlePosition.x < 8)		paddlePosition.x = 8;
    else if (paddlePosition.x > 152)	paddlePosition.x = 152;
    //console.log(paddlePosition.x);
};