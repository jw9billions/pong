
var canvas, context, width, height;

function init(){
  canvas = document.getElementById("table-canvas");
  canvas.width = "650";
  canvas.height = "500";
  context = canvas.getContext("2d");
}

function paintCanvas (){
  context.fillStyle = "darkgreen";
  context.fillRect(0, 0, 650, 500);
}

function drawBoundaries (){
  context.beginPath();
  context.lineWidth = 4;
  context.strokeStyle = "yellow";
  context.strokeRect(20, 20, 610, 460);
}

var keysDown = {};

window.addEventListener("keydown", function (event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
  delete keysDown[event.keyCode];
});


//Paddle Constructor
function Paddle(x, y) {
  this.x = x;
  this.y = y;
  this.width = 15;
  this.height = 100;
  this.color = "lightblue";
  this.y_speed = 10;
  this.edge = {
    top: this.y,
    bottom: this.y + this.height,
    left: this.x,
    right: this.x + this.width
  };
}

//Move distance along y -- 'dy'
Paddle.prototype.move = function (dy){
  this.y += dy;

  //the new edge positions
  this.edge.top += dy;
  this.edge.bottom += dy;
  this.y_speed += dy;
}

Paddle.prototype.update = function () {
  for (var key in keysDown) {
    var val = Number (key);
    if (val === 38) { // keyup
      if (human.paddle.y >= 25) { //move 5 pix on y to origin
          human.paddle.move(-5); // only if paddle y >= 30pix, move 5pix to top boundary
      }
    }

    if (val === 40) { // keydown
      if (human.paddle.y <= 375) { //move 5pix on y away from origin
        human.paddle.move(5); //ony if the paddle y position <= 375pix, still has rooom move 10pix to bottom
      }
    }
  }
}

Paddle.prototype.render = function () {
  context.beginPath();
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.width, this.height);
}

function onKeyDown(e) {
  if (e.keyCode === 38) { // up arrow
    //Move 5 pixels on y towards the origin if y >= 30 pixels (has room to move 10 pix to top)
    if (human.paddle.y >= 25) {
      human.paddle.move(-5);
    }
  }

  if (e.keyCode === 40) { //down arrow
    //Move 5 pixels on y axis away from the origin if y position <=375 pix (still has room move 10 pix to bottom boundary)
    if (human.paddle.y <= 375) {
      human.paddle.move(5);
    }
  }
}
//two paddles
function Human () {
  this.paddle = new Paddle(30, 200);
}

function Computer () {
  this.paddle = new Paddle(605, 200);
}

var human = new Human();
var computer = new Computer();

//Ball Constructor
function Ball(){
  this.x = 325;
  this.y = 250;
  this.color = "yellow";
  this.radius = 10;

  this.edge = {
    right: this.x + 10,
    left: this.x - 10,
    top: this.y - 10,
    bottom: this.y + 10
  }

  this.x_speed = -5;
  this.y_speed = 0;
}

Ball.prototype.render = function(){
  context.fillStyle = this.color;
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  context.fill();
};

var ball = new Ball;

Ball.prototype.update = function (human, computer) {
  var p1 = human.paddle;
  var p2 = computer.paddle;
};

var update = function () {
  ball.update(human, computer);
  human.paddle.update();
};

var render = function (){
  paintCanvas();
  human.paddle.render();
  computer.paddle.render();
  drawBoundaries();
  ball.render();
};

//Steps for each repaint
var step = function step() {
  update();
  render();
  animate(step);
};

//Animate
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000/60)
  };

window.onload = function () {
  init();
  step();
};
