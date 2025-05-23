const arr =['a','b','1'];
console.log(typeof arr);
const date = new Date();
console.log(typeof date);
//如何区分Object的这些类型？
//[object Array]
//[object Date]
//typeof 只能区分基本类型和Object类型，不能区分具体的对象类型
console.log(Object.prototype.toString.call(arr));
console.log(Object.prototype.toString.call(date));
//把console.log(Object.prototype.toString.call(...));封装成一个函数
//就当作一个黑盒子，作用是返回一个字符串，字符串的内容是[object xxx]
//xxx就是对象的类型

//会在MDN 文档看一些资料
//Object.prototype.toString.call()
//slice
function getType(value){
    //string api 的选择
    //split + substring 
    return Object.prototype.toString.call(value).slice(8,-1);//slice 截取字符串
    //slice 可以接受两个参数，第一个参数是起始位置，第二个参数是结束位置，不包含结束位置
    }
console.log(getType(arr));
console.log(getType(date));