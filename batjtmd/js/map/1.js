//NaN Not a Number 不是一个数字
//parserInt  字符串转数字 JS 前端场景
//input输入-> Number 
// map 要接受函数
// forEach 接受函数 没有返回值
// map 接受函数 有返回值
// console.log(['1','2','3'].map(parseInt))
// parseInt num 

['1','2','3'].map((num,index,arr)=>
//num 是数组的每一项 index 是数组的索引 arr 是数组本身
    {
    console.log(num);
    return num;
})

console.log(parseInt('1',0,['1','2','3']))
console.log(parseInt('6',10,['1','2','3']))