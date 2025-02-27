const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundMusic = document.getElementById('backgroundMusic');
const gameOverMusic = document.getElementById('gameOverMusic');
const eatFoodMusic = document.getElementById('eatFoodMusic');

const hasinaImage = new Image();
hasinaImage.src = "./Screenshot 2025-02-18 235254.png";
const helmetImage = new Image();
helmetImage.src = "./helmet.png";

let gridSize = 25;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 10 };
let dx = 1;
let dy = 0;
let score = 0;
let gameInterval;

document.getElementById('up-button').addEventListener('click', () => {
  dx = 0; dy = -1;
});
document.getElementById('down-button').addEventListener('click', () => {
  dx = 0; dy = 1;
});
document.getElementById('left-button').addEventListener('click', () => {
  dx = -1; dy = 0;
});
document.getElementById('right-button').addEventListener('click', () => {
  dx = 1; dy = 0;
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const idealGridSize = Math.min(canvas.width / 30, canvas.height / 15);
    gridSize = Math.max(15, Math.min(30, Math.floor(idealGridSize)));

    generateFood();
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(segment.x * gridSize + gridSize / 2, segment.y * gridSize + gridSize / 2, gridSize / 2, 0, 2 * Math.PI);
        ctx.fill();

        if (index === 0) {
            ctx.drawImage(hasinaImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    });
}

function drawFood() {
    ctx.drawImage(helmetImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood();
    eatFoodMusic.play().catch(console.error);
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize || selfCollision()) {
    clearInterval(gameInterval);
    backgroundMusic.pause();
    gameOverMusic.play().catch(console.error);
    alert("Game Over! Score: " + score);
    location.reload();
  }
}

function selfCollision() {
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  drawSnake();
  drawFood();
  checkCollision();

  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowLeft': dx = -1; dy = 0; break;
    case 'ArrowRight': dx = 1; dy = 0; break;
    case 'ArrowUp': dx = 0; dy = -1; break;
    case 'ArrowDown': dx = 0; dy = 1; break;
  }
});

window.addEventListener('load', () => {
  backgroundMusic.muted = true;
  backgroundMusic.play().catch(error => {
    console.error("Autoplay prevented:", error);
  });

  setTimeout(() => {
    backgroundMusic.muted = false;
  }, 1000);
});

generateFood();
gameInterval = setInterval(gameLoop, 150);

// Touch Event Handlers
let touchStartX;
let touchStartY;

canvas.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

canvas.addEventListener('touchmove', (event) => {
    if (touchStartX === undefined || touchStartY === undefined) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) { dx = 1; dy = 0; }
        else if (deltaX < 0) { dx = -1; dy = 0; }
    } else if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) { dx = 0; dy = 1; }
        else if (deltaY < 0) { dx = 0; dy = -1; }
    }

    // Reset touch coordinates after processing the event
    touchStartX = undefined;
    touchStartY = undefined;
});

