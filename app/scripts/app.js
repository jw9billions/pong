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
  step();
};

var canvas, context;
var width = 650, height = 500;
var humanScore = 0, computerScore = 0;

//Steps for each repaint
var step = function step() {
  update();
  render();
  animate(step);
};

var render = function (){
  paintCanvas();
  drawBoundaries();
  drawScore();
  human.paddle.render();
  computer.paddle.render();
  ball.render();
};

var update = function () {
  ball.update(human, computer);
  human.update();
  computer.update(ball);
};

canvas = document.getElementById("table-canvas");
canvas.width = width;
canvas.height = height;
context = canvas.getContext("2d");


function drawScore() {
	context.globalAlpha=0.2;
	context.font = "bold 70px Verdana";
	context.fillStyle = "black";
	context.fillText(humanScore, 38, 100);
	context.fillText(computerScore, 540, 100);
	context.globalAlpha=1;
}

function paintCanvas (){
  context.fillStyle = "darkgreen";
  context.fillRect(0, 0, 650, 500);
}

function drawBoundaries (){
  context.beginPath();
  context.lineWidth = 5;
  context.strokeStyle = "yellow";
  context.strokeRect(20, 20, 610, 460);
}

var keysDown = {};

window.addEventListener("keydown", function (event) {
  // keysDown[event.keyCode] = true;
  human.direction = event.keyCode;
});

window.addEventListener("keyup", function (event) {
  human.direction = null;
});


//Paddle Constructor
function Paddle(x, y) {
  this.x = x;
  this.y = y;
  this.width = 15;
  this.height = 100;
  this.color = "lightblue";
  this.y_speed = 10;
  this.direction = null;
  this.edge = {
    top: this.y,
    bottom: this.y + this.height,
    left: this.x,
    right: this.x + this.width
  };
}

//Move distance along y -- 'pix'
Paddle.prototype.move = function (dy){
  if (dy < 0) {
    if (this.y < 25) {
      return;
    }
  } else {
    if (this.y > 375) {
      return;
    }
  }

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
  this.paddle = new Paddle(25, 200);
}

function Computer () {
  this.paddle = new Paddle(610, 200);
}

var human = new Human();
var computer = new Computer();

Human.prototype.update = function () {
  if (this.direction === 38) {
    human.paddle.move(-5); // only if paddle y >= 30pix, move 5pix to top boundary
  } else if (this.direction === 40) {
    human.paddle.move(5); //ony if the paddle y position <= 375pix, still has rooom move 10pix to bottom
  }
};

Computer.prototype.update = function (ball) {
  var computer_y = ball.y;
  var diff = -(this.paddle.y + this.paddle.height/2 - computer_y);
  this.paddle.move(diff);
};

function randomVelocity() {
 var num = Math.floor(Math.random() * 4) + 1; // this will get a number between 1 and 5;
 num *= Math.floor(Math.random() * 2) == 1 ? 1 : -1; // this will add minus sign in 50% of cases
 return num;
}

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

  this.x_speed = -10;
  this.y_speed = randomVelocity();
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

  if (this.edge.top < 25) { // hit top wall
    this.y = 25;
    this.y_speed = -this.y_speed;
  } else if (this.edge.bottom > 475) { // hit botttom wall
    this.y = 475;
    this.y_speed = -this.y_speed;
  }

  if (this.x < 20) { // computer scores
    computerScore ++;
    document.getElementById("computerScore").innerHTML = computerScore;
    this.x = 325;
    this.y = 250;
    this.x_speed = 5;
    this.y_speed = randomVelocity();

    if (computerScore > 10) {
      document.getElementById("gameover").innerHTML = "You lose. Click here to play again! 11 points to win";
      document.getElementById("gameover").style.visibility = "visible";
      //document.getElementById("gameover").style.background = "red";
      computerScore = 0;
      humanScore = 0;
      document.getElementById("computerScore").innerHTML = computerScore;
      document.getElementById("humanScore").innerHTML = humanScore;
      this.x_speed = 0;
      this.y_speed = 0;
    }

  } else if (this.x > 610) {
    humanScore ++;
    document.getElementById("humanScore").innerHTML = humanScore;
    this.x = 325;
    this.y = 250;
    this.x_speed = -5;
    this.y_speed = randomVelocity();

    if (humanScore > 10) {
      document.getElementById("gameover").innerHTML = "You won! Click here to play again! 11 points to win!";
      document.getElementById("gameover").style.visibility = "visible";
      //document.getElementById("gameover").style.background = "red";
      computerScore = 0;
      humanScore = 0;
      document.getElementById("computerScore").innerHTML = computerScore;
      document.getElementById("humanScore").innerHTML = humanScore;
      this.x_speed = 0;
      this.y_speed = 0;
    }

  }

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
