# css 基础

- 一个属性与值的建值对成为申明 declaration
- 一个申明块{}中可有多个申明
- 选择器 申明块作用的选择器选择的对应元素
- ruleset 多个
- css 层叠样式表

## css 选择器
+ 兄弟选择器
  只会选择某个元素后紧挨着的同级元素用于样式的一个设置 
  +p+p即可单选第二个p
~ 选择所有位于h1 之后的p元素
  通用兄弟选择器，选后续同级元素。
伪类选择器 状态 如：鼠标悬浮在此区块时，选中内容时
css伪类用于定义元素特殊状态，如:hover、::selection、:active等。  

// 序号
结构伪类
.container p:nth-child(3){}
/* 这里的数字关注的是container的所有的子类元素中的第三个元素 */
/* 若此元素不是p元素则不生效 */
/* 若此元素是p元素但是不是container的子类元素则不生效 */

:nth-child():该选择器会根据元素在其父元素中的位置来选择，不论元素的类型是什么。它会对父元素下的所有子元素进行排序计数，然后选择符合指定位置规则的元素。
:nth-of-type():此选择器仅针对同类型的元素进行计数和选择。它会先筛选出父元素下指定类型的元素，然后在这些元素中根据位置规则选择符合条件的元素。