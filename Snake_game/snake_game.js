// snake_game.js

// --- SETUP ---
const canvas = document.getElementById("gamecanvas");
const gameBoard = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// IMPROVEMENT: Fixed canvas size for reliability
canvas.width = 800;
canvas.height = 600;

// --- DOM ELEMENTS ---
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resumeButton = document.getElementById("resumeButton");
const restartButton = document.getElementById("restartButton");
const resetHighScoreButton = document.getElementById("resetHighScoreButton");
const difficultySelect = document.getElementById("difficulty");
const gameOverOverlay = document.getElementById("gameOverOverlay");
const restartButtonOverlay = document.getElementById("restartButtonOverlay");

// --- GAME STATE ---
const gridSize = 20;
const numCols = canvas.width / gridSize;
const numRows = canvas.height / gridSize;

let snake = [];
let food = {};
let direction = "RIGHT";
let gameInterval;
let speed = 100; // Default speed for medium
let isPaused = false;
let highScore = localStorage.getItem("snakeHighScore") || 0;

// --- AUDIO ---
const eatsound = new Audio("eating.mp3");
const gameOverSound = new Audio("death.mp3");
const movementSound = new Audio("movement.mp3");
const backgroundMusic = new Audio("phonk-brazilian-phonk-music-253422.mp3");
backgroundMusic.loop = true;

// --- DRAWING FUNCTIONS ---
function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "#3b82f6" : "#60a5fa"; // Blue head, lighter body
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
    ctx.strokeStyle = "#1e3a8a"; // Darker border
    ctx.strokeRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function drawFood() {
  ctx.fillStyle = "#ef4444"; // Red
  ctx.strokeStyle = "#b91c1c"; // Darker red border
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// --- GAME LOGIC ---
function generateFood() {
  return {
    x: Math.floor(Math.random() * numCols),
    y: Math.floor(Math.random() * numRows),
  };
}

function moveSnake() {
  if (isPaused) return;

  const head = { ...snake[0] };
  if (direction === "RIGHT") head.x++;
  if (direction === "LEFT") head.x--;
  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    eatsound.play();
  } else {
    snake.pop();
  }
  updateScore();
}

function checkCollision() {
  const head = snake[0];
  // Wall collision
  if (head.x < 0 || head.x >= numCols || head.y < 0 || head.y >= numRows) {
    return true;
  }
  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function gameLoop() {
  if (isPaused) return;

  if (checkCollision()) {
    showGameOver();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  moveSnake();
  drawSnake();
}

// --- UI & STATE MANAGEMENT ---
function updateScore() {
  const currentScore = snake.length - 1;
  // FIX: Update only the number, not the label
  scoreDisplay.textContent = currentScore;
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreDisplay.textContent = highScore;
    localStorage.setItem("snakeHighScore", highScore);
  }
}

function showGameOver() {
  backgroundMusic.pause();
  gameOverSound.play();
  clearInterval(gameInterval);
  updateHighScore();
  // FIX: Show the custom game over screen
  gameOverOverlay.style.display = "flex";
}

function resetGame() {
  snake = [{ x: 10, y: 10 }];
  direction = "RIGHT";
  food = generateFood();
  updateScore();
  gameOverOverlay.style.display = "none";
  isPaused = false;
}

function startGame() {
  resetGame();
  startButton.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  restartButton.classList.remove("hidden");
  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);
}

function setDifficulty() {
  const difficulty = difficultySelect.value;
  if (difficulty === "easy") speed = 150;
  else if (difficulty === "hard") speed = 70;
  else speed = 100;

  // If game is running, restart the interval with the new speed
  if (!isPaused && gameInterval) {
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  }
}

// --- EVENT LISTENERS ---
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (
    (key === "ArrowRight" || key.toLowerCase() === "d") &&
    direction !== "LEFT"
  )
    direction = "RIGHT";
  else if (
    (key === "ArrowLeft" || key.toLowerCase() === "a") &&
    direction !== "RIGHT"
  )
    direction = "LEFT";
  else if (
    (key === "ArrowUp" || key.toLowerCase() === "w") &&
    direction !== "DOWN"
  )
    direction = "UP";
  else if (
    (key === "ArrowDown" || key.toLowerCase() === "s") &&
    direction !== "UP"
  )
    direction = "DOWN";
  movementSound.play();
});

startButton.addEventListener("click", startGame);

pauseButton.addEventListener("click", () => {
  isPaused = true;
  pauseButton.classList.add("hidden");
  resumeButton.classList.remove("hidden");
  backgroundMusic.pause();
});

resumeButton.addEventListener("click", () => {
  isPaused = false;
  resumeButton.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  backgroundMusic.play();
});

// IMPROVEMENT: Both restart buttons now call startGame
restartButton.addEventListener("click", startGame);
restartButtonOverlay.addEventListener("click", startGame);

resetHighScoreButton.addEventListener("click", () => {
  localStorage.removeItem("snakeHighScore");
  highScore = 0;
  highScoreDisplay.textContent = "0";
});

difficultySelect.addEventListener("change", setDifficulty);

// --- INITIALIZE ---
window.onload = () => {
  highScoreDisplay.textContent = highScore;
  scoreDisplay.textContent = "0";
  setDifficulty(); // Set initial speed
};
