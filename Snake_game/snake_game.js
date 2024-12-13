let canvas, ctx, snake, food, direction, gameInterval, score, highScore, isPaused;
let gridSize = 10;
let gameWidth = 500;
let gameHeight = 500;

window.onload = () => {
  canvas = document.getElementById("gamecanvas");
  ctx = canvas.getContext("2d");
  canvas.width = gameWidth;
  canvas.height = gameHeight;

  // Initialize the highscore
  highScore = localStorage.getItem('highScore') || 0;
  document.getElementById("highScore").textContent = `HIGH SCORE: ${highScore}`;
  
  // Setup game control buttons
  document.getElementById("startButton").onclick = startGame;
  document.getElementById("pauseButton").onclick = pauseGame;
  document.getElementById("resumeButton").onclick = resumeGame;
  document.getElementById("restartButtonOverlay").onclick = restartGame;
  document.getElementById("resetHighScore").onclick = resetHighScore;

  // Initialize game variables
  resetGame();
  document.addEventListener("keydown", handleDirection);
};

function startGame() {
  if (gameInterval) return; // Don't start another game if one is running
  resetGame();
  gameInterval = setInterval(gameLoop, 100);
  document.getElementById("pauseButton").classList.remove("hidden");
  document.getElementById("startButton").classList.add("hidden");
}

function resetGame() {
  snake = [{ x: 50, y: 50 }];
  food = generateFood();
  direction = "RIGHT";
  score = 0;
  isPaused = false;
  updateScore();
}

function gameLoop() {
  if (isPaused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  moveSnake();
  checkCollisions();
  drawSnake();
  drawFood();
}

function moveSnake() {
  let head = { ...snake[0] };
  if (direction === "RIGHT") head.x += gridSize;
  if (direction === "LEFT") head.x -= gridSize;
  if (direction === "UP") head.y -= gridSize;
  if (direction === "DOWN") head.y += gridSize;

  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    food = generateFood();
  } else {
    snake.pop();
  }
  updateScore();
}

function checkCollisions() {
  let head = snake[0];
  if (
    head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
    snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
  }
}

function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = "green";
    ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function generateFood() {
  let x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  let y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return { x, y };
}

function updateScore() {
  document.getElementById("score").textContent = `SCORE: ${score}`;
}

function gameOver() {
  clearInterval(gameInterval);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
  }
  document.getElementById("highScore").textContent = `HIGH SCORE: ${highScore}`;
  document.getElementById("scoreOverlay").textContent = `Your Score: ${score}`;
  document.getElementById("highScoreOverlay").textContent = `Highscore: ${highScore}`;
  document.getElementById("gameOverOverlay").classList.remove("hidden");
}

function pauseGame() {
  isPaused = true;
  document.getElementById("resumeButton").classList.remove("hidden");
  document.getElementById("pauseButton").classList.add("hidden");
}

function resumeGame() {
  isPaused = false;
  document.getElementById("pauseButton").classList.remove("hidden");
  document.getElementById("resumeButton").classList.add("hidden");
}

function restartGame() {
  document.getElementById("gameOverOverlay").classList.add("hidden");
  startGame();
}

function resetHighScore() {
  localStorage.removeItem("highScore");
  highScore = 0;
  document.getElementById("highScore").textContent = `HIGH SCORE: 0`;
}

function handleDirection(event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}
