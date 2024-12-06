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

function validateGuess(guess) {
  if(isNaN(guess)){
    alert(`Please enter a Valid Number:`);
  }
  else if(guess<1 || guess>100){
    alert(`Please enter a Valid Number:`);
  }
  else{
    prevGuess.push(guess);
    if(numGuess === 11){
      displayGuess(guess);
      displayMessage(`Game over. Random Number was ${randomNumber}`);
      endgame();
    }
    else{
      displayGuess(guess);
      checkGuess(guess);
    }
  }
}

function checkGuess(guess) {
   if(guess === randomNumber){
      displayMessage(`you guessed it right`);
      endgame();
   }
   else if(guess<randomNumber){
    displayMessage(`Number is too low`)
   }
   else if(guess>randomNumber){
    displayMessage(`Number is too high`)
   }
}

function displayGuess(guess){
  userInput.value='';
  guesslot.innerHTML += `${guess}`;
  numGuess++;
  remainingGuess.innerHTML = `${11-numGuess}`;
}

function displayMessage(Message) {}

function endgame() {}

function newGame() {}


