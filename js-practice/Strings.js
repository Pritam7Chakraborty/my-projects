function rev(sentence){
    return sentence.split(' ').reverse().join(' ');
}

function replaceVowel(sentence){
    return sentence.replace(/[aeiouAEIOU]/g,'*');
}

const a= "PRITAM CHAKRABORTY";
const b= rev(a);
const c= replaceVowel(a);
console.log(b);
console.log(c);


