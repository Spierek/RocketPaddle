ig.module('game.gamestate.title')
.requires('impact.game', 'impact.font', 'game.gamestate.menu', 'game.levels.frame')
.defines(function() {
	Title = ig.Game.extend({
		font: 		new ig.Font('media/04b03.font.png'),
		fontLarge: 	new ig.Font('media/04b032.font.png'),
		logo: 		new ig.Image('media/logo.png'),
		init: function() {
			if( ig.ua.mobile )
    			ig.input.bindTouch( '#canvas', 	'action' );
    		else 
    			ig.input.bind(ig.KEY.MOUSE1, 'action');

			this.loadLevel(LevelFrame);
		},
		update: function() {
			this.parent();
			if (ig.input.pressed('action')) {
				ig.system.setGame(Menu);
			}
		},
		draw: function() {
			this.parent();
			this.logo.draw(19,70);
			this.font.draw('v1.31', 160, 140);

			if( ig.ua.mobile ) {
		        this.font.draw('Tap on the screen to begin.', ig.system.width / 2, ig.system.height - 10, ig.Font.ALIGN.CENTER);
		    }
		    else {
		    	this.font.draw('Click on the screen to begin.', ig.system.width / 2, ig.system.height - 10, ig.Font.ALIGN.CENTER);
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
	});
});