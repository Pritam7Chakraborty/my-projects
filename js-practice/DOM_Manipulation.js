//Task one
const FirstButton = document.getElementById("clickedButton");

FirstButton.addEventListener("click", function(){
    FirstButton.textContent="clicked!";
});

// Task two
const buttonOne= document.getElementById("first");
const buttonTwo= document.getElementById("second");
const buttonThree= document.getElementById("third");

buttonOne.addEventListener("click",function(){
    alert("1st button was clicked");
});

buttonTwo.addEventListener("click",function(){
    alert("2nd button was clicked");
});

buttonThree.addEventListener("click",function(){
    alert("3rd button was clicked");
});

