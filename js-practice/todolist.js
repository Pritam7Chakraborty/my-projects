const input_box = document.querySelector('#input-box');
const list_container = document.querySelector('#list-container');
const submit= document.querySelector('button');

function addTask(){
    if(input_box.value==='')
    {
        alert("you must write something ! stupid!");
    }
    else{
        let li= document.createElement("li");
        li.innerHTML=input_box.value;
        list_container.appendChild(li);
        let span=document.createElement("span");
        span.innerHTML= "\u274C";
        li.appendChild(span);
    }
    input_box.value='';
    saveData();
};

list_container.addEventListener("click",function(e){
    if(e.target.tagName==="LI"){
        e.target.classList.toggle("checked");
        saveData();
    }
    else if(e.target.tagName==="SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
},false)

function saveData(){
    localStorage.setItem("data",list_container.innerHTML);
}

function showlist(){
    list_container.innerHTML=localStorage.getItem("data");
}
showlist();