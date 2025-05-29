# 大数相加

- 高精度
 js Number 类型， 不分整形、浮点数、高精度。。。
 js 不太适合计算 python 适合
 表现力强

- 大数字
  边界问题
  Infinity
  -Infinity
  Number.MAX_VALUE
- 字符串化
  
- es6 bigInt 大数类型

## BigInt
  安全 2^53 -1 9007199254740991  
  es6 新增的第六种简单数据类型 
  后面加 n 申明一个bigint 
  或者 
  BigInt(“123”) 构造函数 不能new 返回一个123n
  可以无限大， 无溢出问题 
  不能和number 混合运算
  使js 适合大型项目开发
