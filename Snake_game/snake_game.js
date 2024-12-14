const canvas = document.getElementById("gamecanvas");
const gameContainer = document.querySelector(".game-container");
canvas.width = gameContainer.clientWidth;
canvas.height = gameContainer.clientHeight;
const ctx = canvas.getContext("2d");

let snake = [{ x: 10, y: 10 }];
let direction = "RIGHT";
let gameInterval;
let speed = 100;
let isPaused = false;
let difficulty = "medium"; // Default difficulty
let highScore = localStorage.getItem("highScore") || 0;

let eatsound = new Audio("eating.mp3");
let gameOverSound = new Audio("death.mp3");
let movementSound = new Audio("movement.mp3");
let banckgroundMusic = new Audio("phonk-brazilian-phonk-music-253422.mp3");

// Constants for grid size
const gridSize = 20;
const numRows = Math.floor(canvas.height / gridSize);
const numCols = Math.floor(canvas.width / gridSize);

// Initialize variables
let food = generateFood();

// Sound functions
function playeatsound() {
  eatsound.play();
}

function playGameOverSound() {
  gameOverSound.play();
}

function playmovementSound() {
  movementSound.play();
}

function playbanckgroundMusic() {
  banckgroundMusic.loop = true;
  banckgroundMusic.play();
}

function stopbanckgroundMusic() {
  banckgroundMusic.pause();
  banckgroundMusic.currentTime = 0;
}

// Draw snake
function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      // Create gradient for snake head
      const gradient = ctx.createLinearGradient(
        segment.x * gridSize,
        segment.y * gridSize,
        segment.x * gridSize + gridSize,
        segment.y * gridSize + gridSize
      );
      gradient.addColorStop(0, "blue");
      gradient.addColorStop(1, "cyan");
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = "violet"; // Violet for body segments
    }
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

// Move snake
function moveSnake() {
  const head = { ...snake[0] };
  if (direction === "RIGHT") head.x++;
  if (direction === "LEFT") head.x--;
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;

  // Check if the snake eats the food
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    food = generateFood();
    document.getElementById("score").textContent = `SCORE: ${snake.length - 1}`;
    playeatsound();
    adjustSpeed();
  } else {
    snake.unshift(head);
    snake.pop();
  }
}

// Generate food
function generateFood() {
  let foodX = Math.floor(Math.random() * numCols);
  let foodY = Math.floor(Math.random() * numRows);
  return { x: foodX, y: foodY };
}

// Draw food
function drawFood() {
  const gradient = ctx.createLinearGradient(
    food.x * gridSize,
    food.y * gridSize,
    food.x * gridSize + gridSize,
    food.y * gridSize + gridSize
  );
  gradient.addColorStop(0, "red");
  gradient.addColorStop(1, "orange");
  ctx.fillStyle = gradient;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Show Game Over Alert
function showGameOver() {
  stopbanckgroundMusic();
  playGameOverSound();
  clearInterval(gameInterval);
  updateHighScore();
  alert("Game Over! Click OK to restart.");
  resetGame();
}

// Update High Score
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem("highScore", highScore);
    document.getElementById(
      "highScore"
    ).textContent = `HIGH SCORE: ${highScore}`;
  }
}

// Reset Game
function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  food = generateFood();
  document.getElementById("score").textContent = "SCORE: 0";
  document.getElementById("startButton").classList.remove("hidden");
  document.getElementById("pauseButton").classList.add("hidden");
  document.getElementById("resumeButton").classList.add("hidden");
  document.getElementById("restartButton").classList.add("hidden");
}

// Main game loop
function gameloop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Check collisions
  if (
    snake[0].x < 0 ||
    snake[0].x >= numCols ||
    snake[0].y < 0 ||
    snake[0].y >= numRows ||
    snake
      .slice(1)
      .some((segment) => segment.x === snake[0].x && segment.y === snake[0].y)
  ) {
    showGameOver();
    return;
  }

  drawFood();
  drawSnake();
  moveSnake();
}

// Keydown event for direction
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
    playmovementSound();
  }
  if (e.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
    playmovementSound();
  }
  if (e.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
    playmovementSound();
  }
  if (e.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
    playmovementSound();
  }
});

// Adjust game speed based on difficulty
function adjustSpeed() {
  if (difficulty === "easy") {
    speed = 120;
  } else if (difficulty === "hard") {
    speed = 70;
  } else {
    speed = 100;
  }
  clearInterval(gameInterval);
  gameInterval = setInterval(gameloop, speed);
}

// Start game button
document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startButton").classList.add("hidden");
  document.getElementById("pauseButton").classList.remove("hidden");
  document.getElementById("restartButton").classList.remove("hidden");
  playbanckgroundMusic();
  gameInterval = setInterval(gameloop, speed);
});

// Pause button
document.getElementById("pauseButton").addEventListener("click", () => {
  clearInterval(gameInterval);
  isPaused = true;
  document.getElementById("pauseButton").classList.add("hidden");
  document.getElementById("resumeButton").classList.remove("hidden");
});

// Resume button
document.getElementById("resumeButton").addEventListener("click", () => {
  gameInterval = setInterval(gameloop, speed);
  isPaused = false;
  document.getElementById("resumeButton").classList.add("hidden");
  document.getElementById("pauseButton").classList.remove("hidden");
});

// Restart button
document.getElementById("restartButton").addEventListener("click", () => {
  resetGame();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameloop, speed);
  playbanckgroundMusic();
});

// Reset High Score button
document
  .getElementById("resetHighScoreButton")
  .addEventListener("click", () => {
    localStorage.removeItem("highScore");
    highScore = 0;
    document.getElementById("highScore").textContent = "HIGH SCORE: 0";
  });

// Difficulty level change
document.getElementById("difficulty").addEventListener("change", (e) => {
  difficulty = e.target.value;
  adjustSpeed();
});

// Initialize
window.onload = () => {
  document.getElementById("highScore").textContent = `HIGH SCORE: ${highScore}`;
  document.getElementById("startButton").classList.remove("hidden");
  document.getElementById("pauseButton").classList.add("hidden");
  document.getElementById("resumeButton").classList.add("hidden");
  document.getElementById("restartButton").classList.add("hidden");
};
