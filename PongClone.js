// Allows animate to make something happen 60 times per second
// Not sure if it happens once or multiple times
var animate = window.requestAnimationFrame;
// ||
//   window.webkitRequestAnimationFrame ||
//   window.mozRequestAnimationFrame ||
//   function(callback) { window.setTimeout(callback, 1000/60) };


var canvas = document.createElement('canvas');
var width = 400;
var height = 600;
canvas.width = width;
canvas.height = height;
// Tells JS that drawing on canvas will be 2D
var context = canvas.getContext('2d');
// canvas.style.backgroundColor = "red";

// Happens once? 
window.onload = function() {
    document.body.appendChild(canvas);
    // Animate processes the step function
    // every time it's called (60 times per second)
    animate(step);
};
// Keeps
var step = function() {
    update();
    render();
    animate(step);
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var update = function() {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};


var render = function() {
    context.fillStyle = "#FF00FF";
    context.fillRect(0,0, width, height);
    player.render();
    computer.render();
    ball.render();
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    // Add y_speed?
}

Paddle.prototype.render = function() {
    context.fillStyle = "#0000FF";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function(x) {
    this.x += x;
    this.x_speed = x;
    if (this.x < 0) { // prevents paddle from passing left side
        this.x = 0;
    } else if (this.x + this.width > 400) { // right wall boundary for paddle
        this.x = 400 - this.width;
    }
}

Player.prototype.update = function() {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 37) { // left arrow
            this.paddle.move(-5);
        } else if (value == 39) { // right arrow
            this.paddle.move(5);
        }
    }
}

function Player() {
    this.paddle = new Paddle(175, 580, 50, 10);
}

function Computer() {
    this.paddle = new Paddle(175, 10, 50, 10);
}

Player.prototype.render = function() {
    this.paddle.render();
};

Computer.prototype.render = function() {
    this.paddle.render();
};

// x, y coordinates represent center of the circle
function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 6;
    this.radius = 5;
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
};

Ball.prototype.update = function(aPlayer, aComputer) {
    this.x += this.x_speed;
    this.y += this.y_speed;
    // Boundaries of ball, accounting for radius
    var left = this.x - this.radius;
    var right = this.x + this.radius;
    var top = this.y - 5;
    var bottom = this.y + 5;


    // HITTING LEFT/RIGHT WALL
    if (left < 0) { // Left
        this.x = 5;
        this.x_speed = -this.x_speed;
    } else if (right > width) { // RIGHT
        this.x = 395;
        this.x_speed = -this.x_speed;
    }

    // POINT SCORED
    if (bottom > 600 || top < 0) {
        this.x_speed = 0;
        this.y_speed = 6;
        this.x = 200;
        this.y = 200;
    }

    // HITTING PLAYER PADDLE (who's on bottom)
    if (bottom >= aPlayer.y && top < aPlayer.y) {
        // if ball is within boundaries of paddle
        if (aPlayer.x < right && aPlayer.x + aPlayer.width > left) {
            // only works with 2, not 0 or 1 (because resetting location of center of ball)
            this.y = aPlayer.y - this.radius;
            this.y_speed = -this.y_speed;
            this.x_speed += aPlayer.x_speed/2;
        }
    // HITTING COMPUTER PADDLE (who's on top)
    } else if (top <= aComputer.y + aComputer.height && bottom > aComputer.y + aComputer.height) {
        if (aComputer.x < right && aComputer.x + aComputer.width > left) {
            // only works with 2, not 0 or 1
            this.y = aComputer.y + aComputer.height + this.radius;
            this.y_speed = -this.y_speed
            this.x_speed += aComputer.x_speed/2;
        }
    }

};


//-------------------------
// CONTROLS
//-------------------------

// creates keysdown object
var keysDown = {};
// whenever key is pressed down, that key is added to 
// the keysdown object with a value of true
window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});
// Removed from keysdown object once key is no longer pressed
window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
})



//-------------------------
// COMPUTER AI
//-------------------------


Computer.prototype.update = function(ball) {
    if (ball.x > this.paddle.x + this.paddle.width) {
        this.paddle.move(4);
    } else if (ball.x < this.paddle.x) {
        this.paddle.move(-4)
    }
}