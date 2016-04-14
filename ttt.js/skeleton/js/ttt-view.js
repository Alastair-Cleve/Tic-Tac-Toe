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
