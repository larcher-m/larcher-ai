//声明了对象常量 
// 内存中开辟了一个空间，里面存放了一个对象
// hxt 取址 & 变量名是地址的标记
//js是一个弱类型语言，变量名可以改变类型 变量的类型由值决定
//= 赋值 Object 
//对象字面量(字面意义上) JSON
//JS 太灵活，不需要new，通过{} 拿到对象[]拿到数组
const hxt = {   
    name: '黄新天',
    age: 20,
    tall:187,
    hometown:'山东',
    isSingle:true,
    sex: '男',
};
//js 灵活
const pyc ={
    name: '彭奕淳',//key value String
    age: 21,//key value Number  数值类型
    tall:187,//key value Number
    hometown:'江西新余',//key value String
    isSingle:true,//key value Boolean
    //送花
    //形参
    sendFlower: function(girl){
    console.log(pyc.name+'送花给'+girl.name+'99朵玫瑰花'); //
    girl.receiveFlower(pyc);//调用函数
    }
    //key value Function这是一个方法
    
};

const xm ={
    xq:30,
    name: '小美',
    room: '408',
    receiveFlower: function(sender){
    
    if (xm.xq >90){
        console.log('xm接受了花并说硕果走一波')
        return;
      }else{
        console.log('xm拒接了花并说gun~~')
      }
    }
}
//帮彭老板的 小美的闺蜜
const xh ={
    xq:30,
    hometown: '新余',//老乡
    name: '小红',
    room: '408',
    //送小红 送小美 都具有receiveFlower 方法
    //对象互换
    //接口 interface
    receiveFlower: function(sender){
/*        if (sender.name === '彭奕淳'){
            console.log('pgg,让我们在一起吧')
            return;
        }
*/
    setTimeout(()=>{//定时器
        xm.xq =99;
        xm.receiveFlower(sender);},3000)
       // xm.receiveFlower(sender);
    }
   
}

pyc.sendFlower(xh);//调用函数
