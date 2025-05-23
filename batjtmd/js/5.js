//全局作用域
function fn(){//函数级作用域
let a=2;

if(true){//支持块级作用域(高级语言的特性) var 不支持块级作用域，let 支持块级作用域
var b=3;}

console.log(b);
}
fn();

if(false){
let value= 1;//块级作用域
}
//在全局找不到
//报错，因为let 是块级作用域，if 是函数级作用域，if 里面的变量只能在if 里面访问，外面访问不到
//console.log(value);