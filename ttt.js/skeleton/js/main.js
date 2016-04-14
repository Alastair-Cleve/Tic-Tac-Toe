var View = require('./ttt-view');
var Game = require('../../ttt-core-solution/game');

$(function () {
  var game = new Game();
  var view = new View(game, $(".ttt"));
  view.setupBoard();
  view.bindEvents();
});
