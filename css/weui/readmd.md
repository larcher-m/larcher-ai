# 微信当家框架WEUI

## BEM 国际命名规范

- 项目 .weui
    - button 页面
- Block 概念
    一块内容 项目代号 风格+ 可服用的代码 
    项目代号 + 区块的作用或指责 page
    .weui-page
    .tm-page
- Element 概念
    元素  __header
        块__
    同一块中概念不重叠
    .weui-page__title
    .weui-page__decs
- UI 框架button , input, cell, 通用的组件
    重启BEM 命名
    .weui-btn 复用         
    业务代码？ 
    大厂，
    基础构架代码 学习WEUI 的源代码
    几个block组合起来， 页面就出来， 组件式开发
- Modifier
    状态
    .weui-btn_primary
    .weui-btn_default
- BEM 规范让我们一起大厂协作    
    - 页面由blocks构成 .weui-{block}__{element}
    - block 包含一些elements
    - element 会有一些状态
         .weui-{block}__{element}--{modifier}
    