const obj={
    name: "Pritam Chakraborty" ,
    age: 21,
    greet: function(){
        console.log(`Hi !! my name is ${this.name}, I am ${this.age} years old`);
    }
};

obj.greet();