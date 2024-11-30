const obj={
    val: 40,
    showval: function (){
        console.log(this.val);
    },
    showvalarrow: ()=>{
        console.log(this.val);
    }
};

obj.showval();
obj.showvalarrow();