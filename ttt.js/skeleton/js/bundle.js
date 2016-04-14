/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	var Game = __webpack_require__(2);

	$(function () {
	  var game = new Game();
	  var view = new View(game, $(".ttt"));
	  view.setupBoard();
	  view.bindEvents();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	var View = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	};

	View.prototype.bindEvents = function () {
	  $("li").on("click", function(event) {
	    var $currentTarget = $(event.currentTarget);
	    this.makeMove($currentTarget);
	  }.bind(this));
	};

	View.prototype.makeMove = function ($square) {
	  var pos = $square.
	    attr("data-pos").
	    split(",").
	    map(function(el) { return parseInt(el); });
	  try {
	    this.game.playMove(pos);
	  } catch(err) {
	    alert("Space already occupied, please make another move.");
	  }

	  var mark = this.game.board.grid[pos[0]][pos[1]];
	  $square.text(mark);
	  $square.css({
	    "background-color": "plum"
	  });

	  $square.unbind('mouseenter mouseleave');

	  if (this.game.isOver()) {
	    var winner = this.game.board.winner();
	    alert("Congrats " + winner + "!");
	  }
	};

	View.prototype.setupBoard = function () {
	  var $ul = $("<ul></ul>");

	  for (var i = 0; i < 3; i++) {
	    for (var j = 0; j < 3; j++) {
	      var $li = $("<li></li>)");
	      $li.attr("data-pos", "" + i + "," + j);

	      $ul.append($li);
	    }
	  }

	  this.$el.append($ul);

	  $("li").css({
	    "float": "left",
	    "background-color": "cornflowerblue",
	    "list-style": "none",
	    "width": "100px",
	    "height": "100px",
	    "outline": "7px solid midnightblue",
	    "font-family": "Arial",
	    "font-size": "100px",
	    "text-align": "center",
	    "line-height": "90px"
	    }
	  );

	  $("li").hover(function() {
	    $(this).css({"background-color": "violet"});
	  }, function() {
	    $(this).css({"background-color": "cornflowerblue"});
	  });

	  $("ul").css({
	    "width": "330px",
	    "margin": "auto"
	    }
	  );
	};

	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(3);
	var MoveError = __webpack_require__(4);

	function Game () {
	  this.board = new Board();
	  this.currentPlayer = Board.marks[0];
	}

	Game.prototype.isOver = function () {
	  return this.board.isOver();
	};

	Game.prototype.playMove = function (pos) {
	  this.board.placeMark(pos, this.currentPlayer);
	  this.swapTurn();
	};

	Game.prototype.promptMove = function (reader, callback) {
	  var game = this;

	  this.board.print();
	  console.log("Current Turn: " + this.currentPlayer);

	  reader.question("Enter rowIdx: ", function (rowIdxStr) {
	    var rowIdx = parseInt(rowIdxStr);
	    reader.question("Enter colIdx: ", function (colIdxStr) {
	      var colIdx = parseInt(colIdxStr);
	      callback([rowIdx, colIdx]);
	    });
	  });
	};

	Game.prototype.run = function (reader, gameCompletionCallback) {
	  this.promptMove(reader, (function (move) {
	    try {
	      this.playMove(move);
	    } catch (e) {
	      if (e instanceof MoveError) {
	        console.log(e.msg);
	      } else {
	        throw e;
	      }
	    }

	    if (this.isOver()) {
	      this.board.print();
	      if (this.winner()) {
	        console.log(this.winner() + " has won!");
	      } else {
	        console.log("NO ONE WINS!");
	      }
	      gameCompletionCallback();
	    } else {
	      // continue loop
	      this.run(reader, gameCompletionCallback);
	    }
	  }).bind(this));
	};

	Game.prototype.swapTurn = function () {
	  if (this.currentPlayer === Board.marks[0]) {
	    this.currentPlayer = Board.marks[1];
	  } else {
	    this.currentPlayer = Board.marks[0];
	  }
	};

	Game.prototype.winner = function () {
	  return this.board.winner();
	};

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var MoveError = __webpack_require__(4);

	function Board () {
	  this.grid = Board.makeGrid();
	}

	Board.isValidPos = function (pos) {
	  return (
	    (0 <= pos[0]) && (pos[0] < 3) && (0 <= pos[1]) && (pos[1] < 3)
	  );
	};

	Board.makeGrid = function () {
	  var grid = [];

	  for (var i = 0; i < 3; i++) {
	    grid.push([]);
	    for (var j = 0; j < 3; j++) {
	      grid[i].push(null);
	    }
	  }

	  return grid;
	};

	Board.marks = ["x", "o"];

	Board.prototype.isEmptyPos = function (pos) {
	  if (!Board.isValidPos(pos)) {
	    throw new MoveError("Is not valid position!");
	  }

	  return (this.grid[pos[0]][pos[1]] === null);
	};

	Board.prototype.isOver = function () {
	  if (this.winner() != null) {
	    return true;
	  }

	  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
	    for (var colIdx = 0; colIdx < 3; colIdx++) {
	      if (this.isEmptyPos([rowIdx, colIdx])) {
	        return false;
	      }
	    }
	  }

	  return true;
	};

	Board.prototype.placeMark = function (pos, mark) {
	  if (!this.isEmptyPos(pos)) {
	    throw new MoveError("Is not an empty position!");
	  }

	  this.grid[pos[0]][pos[1]] = mark;
	};

	Board.prototype.print = function () {
	  var strs = [];
	  for (var rowIdx = 0; rowIdx < 3; rowIdx++) {
	    var marks = [];
	    for (var colIdx = 0; colIdx < 3; colIdx++) {
	      marks.push(
	        this.grid[rowIdx][colIdx] ? this.grid[rowIdx][colIdx] : " "
	      );
	    }

	    strs.push(marks.join("|") + "\n");
	  }

	  console.log(strs.join("-----\n"));
	};

	Board.prototype.winner = function () {
	  var posSeqs = [
	    // horizontals
	    [[0, 0], [0, 1], [0, 2]],
	    [[1, 0], [1, 1], [1, 2]],
	    [[2, 0], [2, 1], [2, 2]],
	    // verticals
	    [[0, 0], [1, 0], [2, 0]],
	    [[0, 1], [1, 1], [2, 1]],
	    [[0, 2], [1, 2], [2, 2]],
	    // diagonals
	    [[0, 0], [1, 1], [2, 2]],
	    [[2, 0], [1, 1], [0, 2]]
	  ];

	  for (var i = 0; i < posSeqs.length; i++) {
	    var winner = this.winnerHelper(posSeqs[i]);
	    if (winner != null) {
	      return winner;
	    }
	  }

	  return null;
	};

	Board.prototype.winnerHelper = function (posSeq) {
	  for (var markIdx = 0; markIdx < Board.marks.length; markIdx++) {
	    var targetMark = Board.marks[markIdx];
	    var winner = true;
	    for (var posIdx = 0; posIdx < 3; posIdx++) {
	      var pos = posSeq[posIdx];
	      var mark = this.grid[pos[0]][pos[1]];

	      if (mark != targetMark) {
	        winner = false;
	      }
	    }

	    if (winner) {
	      return targetMark;
	    }
	  }

	  return null;
	};

	module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function MoveError (msg) {
	  this.msg = msg;
	}

	module.exports = MoveError;


/***/ }
/******/ ]);