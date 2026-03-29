import { startDetectionHand } from './handdetect.js';
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
let playOnLoad  = true;
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var baseSpeed = 1;

let playing = false;

var paddleHeight = 10;
var paddleWidth = 120;
var paddleX = (canvas.width - paddleWidth) / 2;
// var paddleXOld = paddleX;
var stackpaddleX = [];
stackpaddleX.push(paddleX);
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
	bricks[c] = [];
	for (var r = 0; r < brickRowCount; r++) {
		bricks[c][r] = { x: 0, y: 0, status: 1 };
	}
}

document.addEventListener("keydown", keyDownHandler, false);
// document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
	
	if (e.code == "ArrowRight") {
		rightPressed = true;
	}
	else if (e.code == 'ArrowLeft') {
		leftPressed = true;
	}
	if (e.code == "Space"){
		if (!playing) {
			startCountdownGamePlay();
		// playing = true;
		requestAnimationFrame(draw);
	}
	}
}
function keyUpHandler(e) {
	if (e.code == 'ArrowRight') {
		rightPressed = false;
	}
	else if (e.code == 'ArrowLeft') {
		leftPressed = false;
	}
}

const countdownOverlay = document.getElementById("countdown-overlay");
const countdownText = document.getElementById("countdown-text");
const loadingSpinner = document.getElementById("loading-spinner");

let mediapipeLoaded = false;
let loadingCount = 5; // Initial loading countdown

function updateLoadingTimer() {
    if (!mediapipeLoaded) {
        if (loadingCount > 0) {
            countdownText.innerText = "Loading MediaPipe... " + loadingCount;
            loadingCount--;
            setTimeout(updateLoadingTimer, 500);
			if (loadingCount === 0) {
				loadingCount = 10;
			}
				
        } else {
            countdownText.innerText = "Wait for camera...";
        }
    } else {
        countdownOverlay.style.display = "none";
    }
}

updateLoadingTimer();

function startCountdown() {
    mediapipeLoaded = true;
    loadingSpinner.style.display = "none";
}


function startCountdownGamePlay() {
	if (countdownOverlay.style.display === "flex"){
		playing = true;
		return;

	}  // Prevent multiple starts
	if (playing){
		return;
	}
	countdownOverlay.style.display = "flex";
	// loadingSpinner.style.display = "block";
    let count = 5;
    countdownText.innerText = "Go in " + count;
    
    const timer = setInterval(() => {
        count--;
        if (count > 0) {
            countdownText.innerText = "Play in " + count;
        } else if (count === 0) {
            countdownText.innerText = "GO! GO! GO!";
			loadingSpinner.style.display = "none";
			playing = true;
        } else {
            clearInterval(timer);
            countdownOverlay.style.display = "none";
            
        }
    }, 300);
}

function coordinatesCallback(x, y) {
  if (x) {
    let coordinate = ((x * canvas.width) / 100).toFixed(0);
    coordinate = parseInt(coordinate, 10);
    moveHandler(coordinate + canvas.offsetLeft);
	if (!playing){
		// startCountdownGamePlay();
	}
  }
}

startDetectionHand(coordinatesCallback, startCountdown);

function moveHandler(clientX){
	// let paddleXOld = paddleX;
	
	var relativeX = clientX - canvas.offsetLeft;
	let condition = relativeX > 0 && relativeX < canvas.width ? true:false;
	//console.log(`Relative X: ${relativeX} coordinate ${clientX} condition ${condition}`);
	// console.log(`Relative X: ${relativeX} coordinate ${clientX} condition ${condition}`);
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;

		stackpaddleX.push(paddleX);
	}

		
}

function mouseMoveHandler(e) {
	// moveHandler(e.clientX);
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 && relativeX < canvas.width) {
		paddleX = relativeX - paddleWidth / 2;
	}
}
function collisionDetection() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					// playing = false;
					score++;
					if (score == brickRowCount * brickColumnCount) {
						alert("YOU WIN, CONGRATS!");
						playing = false;
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}
function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}
function drawBricks() {
	for (var c = 0; c < brickColumnCount; c++) {
		for (var r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}
function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function draw() {
	requestAnimationFrame(draw);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	if (!playing) {
		return;
	}

	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		dy = -dy;
	}
	else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		}
		else {
			
			lives--;
			playing = false;
			if (!lives) {
				alert("GAME OVER");
				playing = false;
				document.location.reload();
			}
			else {
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = 2;
				dy = -2;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	x += dx;
	y += dy;
	
	
}

requestAnimationFrame(draw);
// draw();
