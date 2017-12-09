var canvas = document.getElementById("table-canvas");
var context = canvas.getContext("2d");

//table
context.beginPath();
context.lineWidth = 4;
context.fillStyle = "darkgreen";
context.fillRect(60, 60, 650, 450);
context.strokeStyle = "yellow";
context.strokeRect(70, 70, 620, 420);

//Paddle Constructor
function Paddle(x, y) {
  this.x = x;
  this.y = y;
  this.width = 15;
  this.height = 100;
  this.color = "lightblue";
  this.render = function() {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

//two paddles--players
var player = new Paddle(72, 230);
var computer= new Paddle(673, 230);

player.render();
computer.render();

//Ball Constructor
function Ball(){
  this.x = 95;
  this.y = 280;
  this.radius = 9;
  this.render = function(){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 3*Math.PI, false);
    context.fillStyle = 'yellow';
    context.fill();
  };
}

var ball = new Ball;
ball.render();
