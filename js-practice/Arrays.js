const arr= [1,2,3,404,5,8,10];
let sum=0;
 arr.forEach(sumofAll) ;

function sumofAll(item)
 {
    sum+= item;
 }

// USING REDUCE: 
// const sum= arr.reduce((totalval,item)=>totalval+item,0)

// EVEN NUMBERS:

function filterArray(array){
    return array.filter((num)=>num%2===0);
}
const evenNumbers=filterArray(arr)

 console.log(`Total sum is ${arr}`);
console.log(evenNumbers);

 