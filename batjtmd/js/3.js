var b = 2;//es5
let a = 1;//es6 推出来了全新的let 2015年
//两个都是变量声明，一个是var，一个是let
//let 是块级作用域，var 是函数级作用域
//let 是变量提升，var 是变量声明提升
//let 是不能重复声明，var 是可以重复声明的
b = 3;
a++;
console.log(a);
console.log(b);