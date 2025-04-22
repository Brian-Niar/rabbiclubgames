const gameArea = document.getElementById('game-area');
const playerCar = document.getElementById('player-car');
const scoreElem = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let gameInterval;
let obstacleInterval;
let score = 0;
let playerPosition = 130; // initial left position in px
const gameAreaWidth = 300;
const carWidth = 40;
const obstacleWidth = 40;
const obstacleHeight = 70;
const moveStep = 20;

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.floor(Math.random() * (gameAreaWidth - obstacleWidth)) + 'px';
    obstacle.style.top = '-80px';
    gameArea.appendChild(obstacle);
    return obstacle;
}

function moveObstacles() {
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        let top = parseInt(obstacle.style.top);
        top += 5;
        if (top > 400) {
            obstacle.remove();
            score++;
            scoreElem.textContent = 'Score: ' + score;
        } else {
            obstacle.style.top = top + 'px';
            if (checkCollision(playerCar, obstacle)) {
                endGame();
            }
        }
    });
}

function checkCollision(car, obstacle) {
    const carRect = car.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        carRect.top > obstacleRect.bottom ||
        carRect.bottom < obstacleRect.top ||
        carRect.right < obstacleRect.left ||
        carRect.left > obstacleRect.right
    );
}

function movePlayerCar(direction) {
    if (direction === 'left') {
        playerPosition = Math.max(0, playerPosition - moveStep);
    } else if (direction === 'right') {
        playerPosition = Math.min(gameAreaWidth - carWidth, playerPosition + moveStep);
    }
    playerCar.style.left = playerPosition + 'px';
}

function startGame() {
    score = 0;
    scoreElem.textContent = 'Score: ' + score;
    playerPosition = 130;
    playerCar.style.left = playerPosition + 'px';
    gameInterval = setInterval(moveObstacles, 50);
    obstacleInterval = setInterval(createObstacle, 1500);
    restartBtn.style.display = 'none';
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    const popup = document.getElementById('game-over-popup');
    const message = document.getElementById('game-over-message');
    popup.classList.remove('hidden');
    message.textContent = 'Game Over! Your score: ' + score;
    restartBtn.style.display = 'inline-block';
}

const popupRestartBtn = document.getElementById('dashboard-btn') || document.getElementById('popup-restart-btn');
if (popupRestartBtn) {
    popupRestartBtn.addEventListener('click', () => {
        const popup = document.getElementById('game-over-popup');
        popup.classList.add('hidden');
        startGame();
    });
}

restartBtn.addEventListener('click', startGame);

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        movePlayerCar('left');
    } else if (e.key === 'ArrowRight') {
        movePlayerCar('right');
    }
});

let isDragging = false;
let dragStartX = 0;
let carStartX = 0;

gameArea.addEventListener('touchstart', (e) => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    carStartX = playerPosition;
});

gameArea.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - dragStartX;
    playerPosition = Math.min(Math.max(carStartX + deltaX, 0), gameAreaWidth - carWidth);
    playerCar.style.left = playerPosition + 'px';
    e.preventDefault();
});

gameArea.addEventListener('touchend', () => {
    isDragging = false;
});

gameArea.addEventListener('mousemove', (e) => {
    if (e.buttons !== 1) return; // only when mouse button is pressed
    const rect = gameArea.getBoundingClientRect();
    let mouseX = e.clientX - rect.left - carWidth / 2;
    playerPosition = Math.min(Math.max(mouseX, 0), gameAreaWidth - carWidth);
    playerCar.style.left = playerPosition + 'px';
});

startGame();
