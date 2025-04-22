const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const difficultySelect = document.querySelector('#game-over-popup #difficulty-select');

let ballRadius;
let x;
let y;
let dx;
let dy;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX;

let rightPressed = false;
let leftPressed = false;

let brickRowCount;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let score = 0;

let bricks = [];

const scoreElem = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const gameOverPopup = document.getElementById('game-over-popup');
const gameOverMessage = document.getElementById('game-over-message');
const popupRestartBtn = document.getElementById('popup-restart-btn');

function initBricks() {
    bricks = [];
    for(let c=0; c<brickColumnCount; c++) {
        bricks[c] = [];
        for(let r=0; r<brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

function setDifficulty(level) {
    switch(level) {
        case 'easy':
            brickRowCount = 3;
            ballRadius = 8;
            dx = 2;
            dy = -2;
            break;
        case 'medium':
            brickRowCount = 5;
            ballRadius = 10;
            dx = 3;
            dy = -3;
            break;
        case 'hard':
            brickRowCount = 7;
            ballRadius = 12;
            dx = 4;
            dy = -4;
            break;
        default:
            brickRowCount = 5;
            ballRadius = 10;
            dx = 3;
            dy = -3;
    }
    paddleX = (canvas.width - paddleWidth) / 2;
    initBricks();
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

const brickColors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#FFC300', '#33FFF3', '#8E44AD'];

function drawBricks() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status === 1) {
                const brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                const colorIndex = (r + c) % brickColors.length;
                ctx.fillStyle = brickColors[colorIndex];
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            const b = bricks[c][r];
            if(b.status === 1) {
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    scoreElem.textContent = 'Score: ' + score;
                    if(score === brickRowCount * brickColumnCount) {
                        gameOverMessage.textContent = 'You win! Congratulations!';
                        gameOverPopup.classList.remove('hidden');
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            endGame();
            return;
        }
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

difficultySelect.addEventListener('change', () => {
    startGame();
});

const countdownElem = document.getElementById('countdown');

function startGame() {
    score = 0;
    scoreElem.textContent = 'Score: ' + score;
    setDifficulty(difficultySelect.value);
    x = canvas.width / 2;
    y = canvas.height - 30;
    paddleX = (canvas.width - paddleWidth) / 2;

    let countdown = 2;
    countdownElem.textContent = countdown;
    countdownElem.style.display = 'block';

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownElem.style.display = 'none';
            draw();
        } else {
            countdownElem.textContent = countdown;
        }
    }, 1000);
}

function endGame() {
    gameOverMessage.textContent = 'Game Over! Your score: ' + score;
    gameOverPopup.classList.remove('hidden');
}

popupRestartBtn.addEventListener('click', () => {
    gameOverPopup.classList.add('hidden');
    startGame();
});

restartBtn.addEventListener('click', () => {
    startGame();
});

document.addEventListener('keydown', (e) => {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
});

document.addEventListener('keyup', (e) => {
    if(e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if(e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
});

let isTouching = false;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isTouching = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    paddleX = touchX - paddleWidth / 2;
    clampPaddle();
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (isTouching) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const touchX = touch.clientX - rect.left;
        paddleX = touchX - paddleWidth / 2;
        clampPaddle();
    }
});

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isTouching = false;
});

// Mouse movement support for moving paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    paddleX = mouseX - paddleWidth / 2;
    clampPaddle();
});

function clampPaddle() {
    if (paddleX < 0) {
        paddleX = 0;
    } else if (paddleX > canvas.width - paddleWidth) {
        paddleX = canvas.width - paddleWidth;
    }
}

startGame();
