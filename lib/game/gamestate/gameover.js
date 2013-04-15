ig.module('game.gamestate.gameover')
.requires('impact.game', 'impact.font', 'game.levels.frame', 'plugins.impact-storage')
.defines(function() {
	GameOver = ig.Game.extend({
		font: 		new ig.Font('media/04b03.font.png'),
		fontLarge: 	new ig.Font('media/04b032.font.png'),
		storage: 	new ig.Storage(),

		init: function() {
			ig.input.bind(ig.KEY.MOUSE1, 'action');
			this.loadLevel(LevelFrame);
			this.score = this.storage.get('score');

			// post score
			var leaderboard = new Clay.Leaderboard( { id: 1061 } );
			leaderboard.post( { score: this.score }, function( response ) {
			    console.log( response );
			} );

			// set achievements
			if (this.score > 1000)
				( new Clay.Achievement( { id: 'rp6' } ) ).award();
			if (this.score > 3000)
				( new Clay.Achievement( { id: 'rp7' } ) ).award();
		},
		update: function() {
			this.parent();
			if (ig.input.pressed('action')) {
				ig.system.setGame(Menu);
			}
		},
		draw: function() {
			this.parent();
			this.fontLarge.draw('GAME OVER', 100, 70, ig.Font.ALIGN.CENTER);
			this.font.draw('You managed to get', 100, 90, ig.Font.ALIGN.CENTER);
			this.fontLarge.draw(this.storage.get('score'), 100, 100, ig.Font.ALIGN.CENTER);
			this.font.draw('points.', 100, 115, ig.Font.ALIGN.CENTER);
			this.font.draw('Do not give up.\nYou can do it.', 100, 140, ig.Font.ALIGN.CENTER);
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