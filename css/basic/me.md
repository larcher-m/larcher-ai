 # css 结构 

 <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>

## body 元素
   <div></div> 块元素

   <span></span> 行内元素
   <br/> 空元素
   <img src="" alt=""> 图片元素
   <input type="text"> 表单元素
   <a href=""></a> 超链接元素

   <ul>
       <li></li>
   </ul> 列表元素
   
   <table>
       <tr>
           <td></td>
       </tr>
   </table> 表格元素
   
   <iframe></iframe> 框架元素
   <canvas></canvas> 画布元素
<video></video> 视频元素
<audio></audio> 音频元素
<embed></embed> 嵌入元素
<object></object> 对象元素
<source></source> 源元素
<param></param> 参数元素
<colgroup></colgroup> 列组元素
<col></col> 列元素
<caption></caption> 标题元素


<thead></thead> 表头元素
<tbody></tbody> 表身元素


<tfoot></tfoot> 表尾元素


<tr></tr> 行元素
<td></td> 单元格元素
<th></th> 表头单元格元素


<details></details> 细节元素
<summary></summary> 摘要元素
<menu></menu> 菜单元素


## css伪类
CSS伪类是CSS中用来 描述元素特殊状态或位置 的选择器，简单说就是“给满足特定条件的元素加样式”。

### 核心特点：
它不直接选中元素本身，而是选中元素的 某种状态 （如鼠标悬停）或 在结构中的位置 （如第一个子元素）。

### 常见例子：
- 状态类伪类 （根据用户交互变化）：
  
  - :hover ：鼠标悬停在元素上时（比如鼠标移到链接上变颜色）。
  - :active ：元素被激活时（如按钮被按下未松开）。
  - :focus ：元素获得焦点时（如输入框被点击选中）。
- 结构类伪类 （根据元素在HTML中的位置）：
  
  - :first-child ：选中父元素的第一个子元素（如列表的第一项）。
  - :last-child ：选中父元素的最后一个子元素（如列表的最后一项）。
  - :nth-child(n) ：选中父元素的第n个子元素（如 li:nth-child(2) 选第二个列表项）。
### 简单示例：
比如在 d:\lesson_si\css\basic\3.html 中，若想让鼠标悬停在 <h1> 上时变红色，可以这样写CSS：
h1:hover {
  color: red; /* 鼠标悬停时标题变红 */
}

这里 :hover 就是伪类，它选中了 <h1> 元素的“悬停状态”。