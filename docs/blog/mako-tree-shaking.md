---
title: Mako - Mako Tree Shaking 简介
publishedAt : 2024-06-26 00:00:00
authors:
  - name: stormslowly
    link: https://github.com/stormslowly
---

## Mako Tree Shaking 简介

_2024-06-26 by [stormslowly](https://github.com/stormslowly)_

在本文开始之前需要郑重的感谢下开源前辈 [Farm](https://github.com/farm-fe/farm) ，Mako 的 tree shaking 算法大量的参考(~~抄~~)了 Farm 的实现。在 Mako 实现 tree shaking 之初，我们一头雾水毫无头绪，有前辈的无私的领路才让 Mako 成为可能。感恩，感谢！

## 什么是 tree shaking

先看下 [Wiki 上的定义](https://en.wikipedia.org/wiki/Tree_shaking)。

> In computing, tree shaking is a **dead code elimination** technique that is applied when optimizing code. Often contrasted with traditional single-library dead code elimination techniques common to minifiers, tree shaking eliminates unused functions from** across** the bundle by starting at the entry point and only including functions that may be executed. It is succinctly described as "live code inclusion".

简单总结下。

1. tree shaking 是一种死代码删除 (dead code elimination) 技术
2. tree shaking 根据模块间（across）的信息来完成死代码的删除的

Tree shaking 利用的是模块间的信息，进行的 dead code 删除。dead code 删除有很多的方式，比如代码minify 时候的 compress，但它不是 tree shaking。Tree shaking 需要利用 ESM 之间的引用信息；在某些场景下，CommonJS 之间也能分析出模块间的引用关系，也能实现 tree shaking。Bundler 的老大哥 Webpack 支持 JSON 资源的 tree shaking（你的 JSON 文件中某个字段没用到，直接帮你删了，比如 `package.json` 打包之后就留个 name 和 version 字段）。

最重要的一点，tree shaking 就是一个概念，并没有具体实现的规范。所以各家 bundler 可以天马行空的实现，大家也可以天马行空的提出新的想法。总之 tree shaking 广阔天地大有所为。

## Mako 的 tree shaking

Mako tree shaking 大致流程 ：

1. 先根据本模块_所有_被引用的导出变量，移除本模块中没有被使用到的语句
2. 移除完这些语句后，分析出本模块引用了各个依赖模块的哪些变量，将这些引用信息记录到依赖模块上。
3. 如果一个模块的所有被引用情况都记录完之后，对这个模块执行第1 步。

如此往复下去就可以把整个项目中所有没有使用到的代码移除掉，就完成了 tree shaking。

### 大致描述下的问题

但是事情真的有说的这么简单吗？这个“大致”描述里面有两个问题。

1. 我们应该从哪个模块开始 tree shaking，即哪个模块会最先收集完它所有被引用的情况？
2. 怎么确定一个模块是否收集完了它的所有的被引用情况？

第 1 个问题很好回答，entry 模块是第一个收集完所有被引用情况的模块，因为entry 模块不会被引用。

那么我们顺着这个思路继续想，当 entry 模块完成了 tree shaking，那么我们就得到了他的所有依赖的模块的变量的引用情况。如果某个依赖只被 entry 引用了，那么我们就能对他进行 tree shaking。

但是如果这个模块还有被其他的模块引用，那么我们如何确认已经分析完所有的依赖方对他的引用呢？通过不断的模块的依赖图上查询是一个直接的想法，但是这样的查询会涉及到递归，因为本模块被依赖变量需要查询所有依赖方的被依赖，依赖方又要查询它的依赖方，显然不是一个高效的方式。

这个时候就要介绍一个非常有用的工具：[拓扑排序](https://zh.wikipedia.org/zh-cn/%E6%8B%93%E6%92%B2%E6%8E%92%E5%BA%8F)。

在一个项目中，如把模块和模块之间的引用关系绘制成一张有向图；将这个图的入口设为项目的 entry ，那么我可以从 entry 点对这个图进行一次拓扑排序。在拓步排序的结果中对于任意一个节点他的所有的引用方都排在它的前面。如果做一个比喻的话，引用方是被引用方的父节点，拓扑排序就是一个按照辈分的排序。这个特性下显然 entry 模块肯定排在拓扑排序的第一位。

下面，我们来看一个拓扑排序的例子。

![](https://mdn.alipayobjects.com/huamei_42epzw/afts/img/A*Kvp5SKmDMpQAAAAAAAAAAAAADiSRAQ/original)

这个模块图拓扑排序的结果如下。

```
entry.ts, app.ts, pages/toods.tsx, pages/home.tsx, layout.tsx, components.tsx
```

有了拓扑排序之后，我们只要按照拓扑排序的顺序逐个的处理模块的 tree shaking，这样就能保证每次处理的模块都已经所收集了所有的引用情况，因为所有的引用方都已经分析过了。

### 还有问题

好了这两个问题都解答了，tree shaking 是不是就能实现了呢？还有两个问题，

- 如何分析出一个模块对其依赖引用变量呢？
- 如何根据被引用的变量，来删除本模块中没用使用过的语句？

这个简单，我们只要在 AST 中分析出能够建立出依赖关系的语句和表达式即可。

```ts
import foo from "src"
import * as namespace from "src"
import {  x as y } from "src"
export { x as y } from "src"
export * from "src"
require("src")
```

例如`import foo from "src"` 就得到了当前模块引用了`src` 模块的中 “default” 变量（这里应该叫 `default` 符号，因为实际上并没有 `default` 变量）。

接下来看第二个问题：如何根据被引用的变量，来删除本模块中没用使用过的语句？这个略微有点复杂。

首先 Mako 的 tree shaking 根据模块的引用关系只删除模块最顶层上下文的语句。所以第一步，要建立起一张模块顶层语句和语句之间的引用的有向图。图中的边描述的是语句 A 引用 语句 B 中定义的变量。

```ts
export { foo as default }
import { peace } from "./c"
import { war }  from "./d"
let love = 22
let hello = peace + love
let hi = hello - 1

function foo(){
  console.log(hello)
}
```

如实例代码中`export` 语句使用了 `foo` 变量，因此两句语句之间有一条边；而 `foo`函数声明语句引用了`hello`变量，所以函数声明语句有一条边指向了`hello`的`let`定义语句。

完整的语句关系图谱如下。

![](https://mdn.alipayobjects.com/huamei_42epzw/afts/img/A*_TvGSaNEYLcAAAAAAAAAAAAADiSRAQ/original)

有了这张图之后，只要根据被引用的导出变量，我们就知道哪些导出语句被使用了，接着通过语句之间的边遍历完所有可以遍历的语句之后，那些没有遍历到的语句就可以被删除(shake)掉了。

假设该模块被 default import 了；那么在 step 1 中，`export` 语句标记上颜色表示被使用，顺着建立的图的边，把访问到的语句到标记上颜色 (注意图中的 step 2，3，4，5)。

那么最后**没有**标记过的语句，就是可以删除掉的语句了。

![](https://mdn.alipayobjects.com/huamei_42epzw/afts/img/A*XoVZQKFPOQ8AAAAAAAAAAAAADiSRAQ/original)

```javascript
export { foo as default }
import { peace } from "./c"

let love = 22
let hello = peace + love


function foo(){
  console.log(hello)
}
```

到了这里，我就得到模块 tree shaking 后的代码，接着分析出 `c`模块被引用了`peace`变量；拓扑序访问到`c`模块后，就可以对它进行 tree shaking 了。

## End

至此 Mako 的 tree shaking 流程，基本介绍完了；也理顺了 Mako tree shaking 的大致的流程。当然这里这次的介绍中还是省略了很多需要处理的技术细节，比如模块中有副作用的语句的判断和处理，再比如 `export * from 'mod'`语句到底导出了哪些“变量”，还有如果模块之间的引用关系形成了一个环应该怎么处理，这些问题本文都没有覆盖。这些可以在开源之后在代码中找到答案，或者等我们的下一篇博客。
