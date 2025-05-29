/**
 * 
 * @param {number} totle 
 * @param {number} num
 * @returns {number[]} 
 */
function hongbao(totle, num) {
    //边界
    const arr = [];
    let restAmount = totle; //剩余金额
    let restNum = num; //剩余个数
    for (let i = 0; i < num - 1; i++) {
        //Math
        //包装类
        let amount =Math.random(restAmount/restNum * 2).toFixed(2); //随机金额
        //console.log(amount);
        restAmount -= amount; //剩余金额
        restNum--; //剩余个数
        arr.push(amount); //添加到数组中
    }
    arr.push(restAmount.toFixed(2)); //添加到数组中
    // 公平性
    // 平均值
    // 随机性
    return arr;
}
console.log(hongbao(100, 10));