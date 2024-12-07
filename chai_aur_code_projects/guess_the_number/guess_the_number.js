let randomNumber = Math.floor(Math.random()*100)+1;

const submit = document.querySelector("#subt");
const userInput = document.querySelector(".guessField");
const guesslot = document.querySelector(".guesses");
const remainingGuess = document.querySelector(".lastResult");
const lowOrHi = document.querySelector(".lowOrHi");
const startOver = document.querySelector(".resultParas");

const p = document.createElement("p");

let prevGuess = [];
let numGuess = 1;

let playgame = true;

if (playgame == true) {
  submit.addEventListener("click", function (e) {
    e.preventDefault();
    console.log("Submit button clicked");
    
    const guess = parseInt(userInput.value);
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
  guesslot.innerHTML += `${guess},  `;
  numGuess++;
  remainingGuess.innerHTML = `${11-numGuess}`;
}

function displayMessage(message) {
  lowOrHi.innerHTML=`<h2>${message}</h2>`;
}

function endgame() {
  userInput.value='';
  userInput.setAttribute('disabled', '');
  p.classList.add('button');
  p.innerHTML=`<h2 id="newGame">Start new game</h2>`;
  startOver.appendChild(p);
  playgame=false;
  newGame();
}

function newGame() {
  const newGameButton = document.querySelector('#newGame');
  newGameButton.addEventListener('click',function(e){
  randomNumber = Math.floor(Math.random()*100)+1;
  prevGuess=[];
  numGuess=1;
  lowOrHi.innerHTML='';
  guesslot.innerHTML='';
  remainingGuess.innerHTML = `${11-numGuess}`;
  userInput.removeAttribute('disabled');
  startOver.removeChild(p);
  playgame=true;
  })
}


