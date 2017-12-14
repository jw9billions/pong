//Animate
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000/60)
  };

window.onload = function () {
  init();
  step();
};

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

//Move distance along y -- 'pix'
Paddle.prototype.move = function (dy){
  this.y += dy;

  //the new edge positions
  this.edge.top += dy;
  this.edge.bottom += dy;
  this.y_speed += dy;
}

Paddle.prototype.render = function () {
  context.beginPath();
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.width, this.height);
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

Human.prototype.update = function () {
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
};

Computer.prototype.update = function (ball) {
  var computer_y = ball.y;
  var diff = -(this.paddle.y + this.paddle.width/2 - computer_y);
  if (diff < 20 && diff < 24) { // max speed up
    diff = -1;
  } else if (diff > 24 && diff > 28) { //max speed down
    diff = 1;
  }

  this.paddle.move(diff);

  if (this.paddle.y < 24) {
    thi.paddle.y = 24;
  } else if (this.paddle.y + this.paddle.height > 610) {
    this.paddle.y = (610 - this.paddle.height);
  }
};

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

  this.x += this.x_speed;
  this.y += this.y_speed;

  this.edge.left += this.x_speed;
  this.edge.right += this.x_speed;

  this.edge.top += this.y_speed;
  this.edge.bottom += this.y_speed;

  //If ball's left edge === right edge of the paddle
  //&& if the ball within the paddle top and bottom edges ---hit!
  if (this.edge.left === p1.edge.right) {
    if (this.edge.top < p1.edge.bottom && this.edge.bottom > p1.edge.top) {
      console.log('hit!');
      this.x_speed = -this.x_speed;
    } else {
      console.log('missed the paddle');
    }
  }

  if (this.edge.right === p2.edge.left) {
    if (this.edge.top < p2.edge.bottom && this.edge.bottom > p2.edge.top){
      console.log('hit!');
      this.x_speed = -this.x_speed;
    } else {
      console.log ('missed the paddle');
    }
  }
};

var update = function () {
  ball.update(human, computer);
  human.update();
  computer.update(ball);
};

var render = function (){
  paintCanvas();
  drawBoundaries();
  human.paddle.render();
  computer.paddle.render();
  ball.render();
};

//Steps for each repaint
var step = function step() {
  update();
  render();
  animate(step);
};
