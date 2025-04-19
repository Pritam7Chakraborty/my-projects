const toggleButton = document.querySelector("#toggleButton");
const toggleParagraph = document.querySelector("#toggleParagraph");

toggleButton.addEventListener("click", function(){
    if(toggleParagraph.style.display==="none"){
        toggleParagraph.style.display="block";
    }
    else{
        toggleParagraph.style.display="none";
    }
});