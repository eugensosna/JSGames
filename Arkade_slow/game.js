//import "./handdetect"

import {  startDetectionHand } from './handdetect.js';

//startDetectonHand(coordinatesCallback);
// Define your callback function


const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

// each row is 14 bricks long. the level consists of 6 blank rows then 8 rows
// of 4 colors: red, orange, green, and yellow
const level1 = [
  [],
  [],
  [],
  [],
  [],
  [],
  ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
  ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'],
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
  ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'],
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
  ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'],
  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'],
  ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y']
];

// create a mapping between color short code (R, O, G, Y) and color name
const colorMap = {
  'R': 'red',
  'O': 'orange',
  'G': 'green',
  'Y': 'yellow'
};

// use a 2px gap between each brick
const brickGap = 2;
const brickWidth = 28;
const brickHeight = 12;
const baseSpeed = 3;

// the wall width takes up the remaining space of the canvas width. with 14 bricks
// and 13 2px gaps between them, thats: 400 - (14 * 25 + 2 * 13) = 24px. so each
// wall will be 12px
const wallSize = 12;
const bricks = [];

// create the level by looping over each row and column in the level1 array
// and creating an object with the bricks position (x, y) and color
for (let row = 0; row < level1.length; row++) {
  for (let col = 0; col < level1[row].length; col++) {
    const colorCode = level1[row][col];

    bricks.push({
      x: wallSize + (brickWidth + brickGap) * col,
      y: wallSize + (brickHeight + brickGap) * row,
      color: colorMap[colorCode],
      width: brickWidth,
      height: brickHeight
    });
  }
}

const paddle = {
  // place the paddle horizontally in the middle of the screen
  x: canvas.width / 2 - brickWidth / 2,
  y: 440,
  width: 90,
  height: brickHeight,

  // paddle x velocity
  dx: 0
};

const ball = {
  x: 130,
  y: 260,
  width: 7,
  height: 7,

  // how fast the ball should go in either the x or y direction
  speed: 2,

  // ball velocity
  dx: 0,
  dy: 0
};



// check for collision between two objects using axis-aligned bounding box (AABB)
// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y;
}
var count = 0
var cameradetect = false;

// game loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move paddle by it's velocity
  var oldX = paddle.x;

  count++;
  if (cameradetect) {
    // console.log(`paddle.x: ${paddle.x}, paddle.dx: ${paddle.dx}, count: ${count}`);

    paddle.x += paddle.dx;
    // console.log(`paddle moved from ${oldX} to ${paddle.x}`);
    paddle.dx = 0; // reset paddle dx after moving
    cameradetect = !cameradetect;
  }
  paddle.x += paddle.dx;

  if (paddle.x !== oldX && Math.abs(paddle.dx) > 3) {
    // console.log(`paddle moved from ${oldX} to ${paddle.x}`);

  }

  // prevent paddle from going through walls
  if (paddle.x < wallSize) {
    paddle.x = wallSize
  }
  else if (paddle.x + brickWidth > canvas.width - wallSize) {
    paddle.x = canvas.width - wallSize - brickWidth;
  }

  // move ball by it's velocity
  ball.x += ball.dx;
  ball.y += ball.dy;

  // prevent ball from going through walls by changing its velocity
  // left & right walls
  if (ball.x < wallSize) {
    ball.x = wallSize;
    ball.dx *= -1;
  }
  else if (ball.x + ball.width > canvas.width - wallSize) {
    ball.x = canvas.width - wallSize - ball.width;
    ball.dx *= -1;
  }
  // top wall
  if (ball.y < wallSize) {
    ball.y = wallSize;
    ball.dy *= -1;
  }
  if (ball.y < canvas.height) {
    if (canvas.height - ball.y < 100 && ball.dy > 0) {
      ball.speed = 0.5
      ball.dy = ball.speed;
      if (ball.dx > 0) {
        ball.dx = ball.speed;
      } else {
        ball.dx = -ball.speed;
      }
      // ball.dy = ball.speed;
      // ball.dx = ball.speed;
    }
    if (ball.y > 430 && ball.dy > 0) {
      ball.speed = baseSpeed;
      ball.dy = ball.speed;
      if (ball.dx > 0) {
        ball.dx = ball.speed;
      } else {
        ball.dx = -ball.speed;
      }

    }
  }

  // reset ball if it goes below the screen
  if (ball.y > canvas.height) {
    ball.x = 130;
    ball.y = 260;
    ball.dx = 0;
    ball.dy = 0;
  }

  // check to see if ball collides with paddle. if they do change y velocity
  if (collides(ball, paddle)) {
    ball.speed = baseSpeed;
    ball.dx = ball.speed;
    ball.dy = ball.speed;
    ball.dy *= -1;

    // ba

    // move ball above the paddle otherwise the collision will happen again
    // in the next frame
    ball.y = paddle.y - ball.height;
  }

  // check to see if ball collides with a brick. if it does, remove the brick
  // and change the ball velocity based on the side the brick was hit on
  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];

    if (collides(ball, brick)) {
      // remove brick from the bricks array
      bricks.splice(i, 1);

      // ball is above or below the brick, change y velocity
      // account for the balls speed since it will be inside the brick when it
      // collides
      if (ball.y + ball.height - ball.speed <= brick.y ||
        ball.y >= brick.y + brick.height - ball.speed) {
        ball.dy *= -1;
      }
      // ball is on either side of the brick, change x velocity
      else {
        ball.dx *= -1;
      }

      break;
    }
  }

  // draw walls
  context.fillStyle = 'lightgrey';
  context.fillRect(0, 0, canvas.width, wallSize);
  context.fillRect(0, 0, wallSize, canvas.height);
  context.fillRect(canvas.width - wallSize, 0, wallSize, canvas.height);

  // draw ball if it's moving
  if (ball.dx || ball.dy) {
    if (ball.speed !== baseSpeed) {
      context.fillStyle = 'orange';
    }
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
  }

  // draw bricks
  bricks.forEach(function (brick) {
    context.fillStyle = brick.color;
    context.fillRect(brick.x, brick.y, brick.width, brick.height);
  });

  // draw paddle
  context.fillStyle = 'cyan';
  context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  // Set the line properties once
  context.strokeStyle = 'cyan';
  context.lineWidth = 4;

  // Set the dash pattern for a dashed line
  context.setLineDash([10, 5]); // 10px line, 5px gap

  // Draw horizontal dashed line at height 320px
  context.beginPath();
  context.moveTo(0, 400);                // Start at left edge
  context.lineTo(canvas.width, 400);     // Go to right edge
  context.strokeStyle = 'cyan';         // Set line color (optional)
  context.lineWidth = 2;                 // Set line width (optional)
  context.stroke();
}

// listen to keyboard events to move the paddle
document.addEventListener('keydown', function (e) {
  // left arrow key
  if (e.which === 37) {
    paddle.dx = -3;
  }
  // right arrow key
  else if (e.which === 39) {
    paddle.dx = 3;
  }

  // space key
  // if they ball is not moving, we can launch the ball using the space key. ball
  // will move towards the bottom right to start
  if (ball.dx === 0 && ball.dy === 0 && e.which === 32) {
    ball.dx = ball.speed;
    ball.dy = ball.speed;
  }
});

// listen to keyboard events to stop the paddle if key is released
document.addEventListener('keyup', function (e) {
  if (e.which === 37 || e.which === 39) {
    paddle.dx = 0;
  }
});

function loggedData(message) {
  const now = new Date();
  const formattedDatetime = now.toLocaleString();
  console.log(`[${formattedDatetime}] ${message}`);

}

startDetectionHand(coordinatesCallback);

// Ensure the main script is loaded before calling its function

window.addEventListener('load', () => {
  loggedData("add listener ");
  // Check if the function exists before calling it
  if (window.startDetection) {
    window.startDetection(coordinatesCallback);
  } else {
    console.error("The 'startDetection' function is not available.");
  }
});

function coordinatesCallback(x, y) {
  cameradetect = true;
  if (x) {
    let coordinate = ((x * canvas.width) / 100).toFixed(0);

    if (coordinate > paddle.x) {
      paddle.dx = coordinate - paddle.x;

    } else if (coordinate < paddle.x) {
      paddle.dx = (paddle.x - coordinate) * -1;
    }
    // console.log(`Callback received: x=${x}%, coordinate ${coordinate} current coordinate ${paddle.x} dx ${paddle.dx}`);
    //paddle.x = coordinate;
    //paddle.x = (paddle.x * canvas.width) / 100 - paddle.width / 2;
    // console.log(`Callback received new coordinate : current coordinate ${paddle.x} dx ${paddle.dx}`);

  }
}
// setTimeout(() => {
//   console.log("set paddle.x to 100");
//   paddle.x = 100;
//   setTimeout(() => {
//     paddle.dx = -50;
//     cameradetect = true;
//     loggedData(`move paddle.x: ${paddle.x}, paddle.dx: ${paddle.dx}`);
//   }, 500);
// }, 10000);


// start the game
requestAnimationFrame(loop);
