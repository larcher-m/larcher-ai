# css animation

- html
 
- css
 ? 在一起？
 border-radius
 animation 世界

 - html结构快捷输入方式
   div#l-ball.ball   emmet 语法 css 选择器

- id 唯一（用于标注元素）

- class 类名（用于标注元素）

- .container?
  盒子 装着两个元素 实现 页面居中
  水平垂直居中
- .container>#l-ball.ball+#r-ball.ball
   >子元素选择器
   +兄弟元素选择器  

- display 改变元素的显示方式  （只改变）
  block 块元素
  inline 行内元素
  inline-block 行内块元素
  div默认 块级元素
  span, i a inline
  display 切换行内块级的格式化上下文能力
  inline-block 行内块级元素 设置宽高 在一行显示
  inline 行内 不可以设置宽高 不会让元素换行
  block 块级 可以设置宽高 独占一行 把其他元素挤下去 会让元素换行

 - 面向对象的css 
  多态
  复用 多类名 

- position定位 
  相对定位 relative
      - 子元素相对它定位
      - 相对于自身的位置定位
  绝对定位 absolute
      - 
  absolute 找到离它（管着它的）最近的position 不为static 的元素定位
  直到body 为止
  .container absolute body
