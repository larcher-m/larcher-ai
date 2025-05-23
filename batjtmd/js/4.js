//全局的js代码在执行之前会先进行预编译，预编译会把所有的var和function提升到当前作用域的顶部，
//变量提升了
console.log(value,'-------');
var a;
a=1;
if(false){
    var value= 1;
}
// undefined类型没定义但是有值
console.log(value);