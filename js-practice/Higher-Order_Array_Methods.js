let pritam=[1,2,3,4,5,6,7,8,9,10];

// function filterarray(){

//      return pritam.filter((num)=>num%2===0);

// }
// const evenNumbers=filterarray();
// console.log("Even Numbers:",evenNumbers);

// function maparray(){
//     return evenNumbers.map((num)=>num*num);
// }

// const mappedarr = maparray();
// console.log("Mapped Array (Squared):",mappedarr);

// function reducearray(){
//     return mappedarr.reduce((sum,num)=> sum+num,0 );
    
// }
// const reducedarr = reducearray();
// console.log(reducedarr);

//ALL IN ONE MERGED : 

const sum_of_squares = pritam.filter((num)=>num%2===0).map((num)=>num*num).reduce((sum,num)=> sum+num,0 );

console.log(sum_of_squares);

