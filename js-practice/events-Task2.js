const inputForm = document.getElementById("inputForm");
const textInput = document.getElementById("textInput");
const listContainer = document.getElementById("listContainer");

inputForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    const Inputvalue = textInput.value.trim();
    if(Inputvalue)
    {
        console.log(`Input value: ${Inputvalue}`);
        addListItem(Inputvalue);
        textInput.value="";
    }
});

listContainer.addEventListener("click",(event)=>{
    if(event.target.tagName==='LI'){
        alert(`You clicked on: ${event.target.textContent}`)
    }
});

function addListItem(text){
    const newItem= document.createElement("li");
    newItem.textContent=text;
    listContainer.appendChild(newItem);
};