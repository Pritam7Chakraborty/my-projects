let randomNumber = Math.random() * 100 + 1;

const submit = document.querySelector("#subt");
const userInput = document.querySelector("#guessField");
const guesslot = document.querySelector("#guesses");
const remainingGuess = document.querySelector("#lastResult");
const lowOrHi = document.querySelector("#lowOrHi");
const startOver = document.querySelector("#resultParas");

const p = document.createElement("p");

let prevGuess = [];
let numGuess = 1;

let playgame = true;

if (playgame == true) {
  submit.addEventListener("click", function (e) {
    e.preventDefault();
    const guess=parseInt(userInput.value);
    console.log(guess);
    validateGuess(guess);
  });
}

function validateGuess(guess) {}

function checkGuess(guess) {}

function displayMessage(Message) {}

function endgame() {}

function newGame() {}
