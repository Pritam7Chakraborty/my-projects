const display= document.getElementById('calc_display') ;

function appendtoDisplay(input)
{
    display.value += input;
}

function clearDisplay()
{

    display.value = "";
}

function calculate(){
    try{
        display.value = eval(display.value);
    }
    catch(error)
    {
        display.value="Error"
    }
}
