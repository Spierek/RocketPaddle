// This code is a mess, please thread carefully :)
/*
++ new levels
*/


ig.module('game.main')
.requires('game.gamestate.title')
.defines(function(){
ig.resetGame = function() {
	ig.system.setGame(Title);
}

ig.main( '#canvas', Title, 60, 200, 240, 2 );

});