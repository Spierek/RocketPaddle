ig.module('game.gamestate.about')
.requires('impact.game', 'impact.font', 'game.levels.frame', 'plugins.impact-storage')
.defines(function() {
	About = ig.Game.extend({
		font: 		new ig.Font('media/04b03.font.png'),
		fontLarge: 	new ig.Font('media/04b032.font.png'),
		storage: 	new ig.Storage(),

		init: function() {
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
			this.fontLarge.draw('ROCKETPADDLE', 100, 25, ig.Font.ALIGN.CENTER);
			this.font.draw('v1.31', 140, 36, ig.Font.ALIGN.CENTER);
			this.font.draw('Code & art by\nLuke "Spierek" Spierewka\n(visit spierek.net)\n\n' +
							'Massive thanks to\nMatt Greer (City41)\n\n', ig.system.width / 2, 60, ig.Font.ALIGN.CENTER);
			this.font.draw('CHANGELOG:\n\n' +
							'- new levels (a total of 20)\n' +
							'- added Clay.io API support\n' +
							'- fixed menu option detection\n' +
							'- fixed level-based achievements\n' +
							'- breaking blocks with paddle gives\n more points (10 instead of 5)\n' +
							'- new achievement\n', 20, 130, ig.Font.ALIGN.LEFT);
			if( ig.ua.mobile ) {
		        this.font.draw('Tap to return to the menu.', ig.system.width / 2, ig.system.height - 10, ig.Font.ALIGN.CENTER);
		    }
		    else {
		    	this.font.draw('Click to return to the menu.', ig.system.width / 2, ig.system.height - 10, ig.Font.ALIGN.CENTER);
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