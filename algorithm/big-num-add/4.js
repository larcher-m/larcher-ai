const bigNum =1234567890123456789012356789123456789n;
// BigInt 申明方式 函数申明
// bigint 简单数据类型 ， 不是对象 ，不是构造函数
const theNum =BigInt("1234567890123456789012356789123456789");//不加双引号会表达不精确
console.log(bigNum,theNum,typeof bigNum,typeof theNum,typeof 1);//bigint 不可以和普通数字相加，但是可以和bigint相加
//console.log(bigNum + 1); //报错，不能和普通数字相加
console.log(bigNum + 1n); //可以相加