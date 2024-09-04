---
title: Mako - 循环依赖检测
publishedAt: 2024-09-04 00:00:00
authors:
  - name: stormslowly
    link: https://github.com/stormslowly
---

# Mako - 循环依赖检测

_2024-09-04 by [stormslowly](https://github.com/stormslowly)_

> 循环依赖是代码中隐藏的风险，一些无意的改动就可能触发，并只能在运行时发现。
Mako 内置循环依赖检测，让代码中的循环依赖尽快发现，排除风险。

> 文中用到的 demo 的[示例代码](https://github.com/stormslowly/circular-deps-demo)

大家多多少少碰到过循环依赖的问题，比如变量明明导出了，但是为什么拿到的是 `undefined`,
或者 `ReferenceError: Cannot access 'foo' before initialization`。最后一查，查半天，严重影响上班~~摸鱼~~时间，最后发现是循环依赖，所以对循环依赖深恶痛绝，欲除之而后快。
但时候有时候发现，有些项目也有循环依赖，但是也没有任何问题，仿佛它又是人畜无害的。
这些问题背后到底是为什么呢？

## 循环依赖到底是怎么回事
### 从一个不报错的循环依赖开始

```javascript
function foo(){
  bar()
}
function bar(){
}

function x(){
  y()
}
function y(){
}
```

![one-big-module](https://mdn.alipayobjects.com/huamei_42epzw/afts/img/A*em24Q7YRQgsAAAAAAAAAAAAADiSRAQ/original)

假设这4个函数的实现日益复杂，需要拆成两个模块，每个模块 2 个函数。那么有 3 个拆法。

1. `{foo, bar}`, `{x, y}`
2. `{foo, x}`, `{ bar, y }`
最后一种青年可能会这么拆分
`{ foo, y }`, `{bar, x}`
那么依赖关系就变成下图，循环依赖就形成了。

![circlular-modules](https://mdn.alipayobjects.com/huamei_42epzw/afts/img/A*IYAdQqLZJ8oAAAAAAAAAAAAADiSRAQ/original)

但是这个循环依赖是可以正常工作的完全没有问题

```javascript
//index.js
import { foo } from './m1';
foo();
```

```javascript
// m1.js
import {bar} from "./m2"
export function y() {
  console.log("y called")
}
export function foo(){
  bar()
}
```

```javascript
// m2.js
import {y} from "./m1"
export function bar(){
  console.log("bar called")
}
export function x(){
  y()
}
```

```bash
Building with mako for development...
Warning Circular Dependencies: "case1/m1.js" -> "case1/m2.js" -> "case1/m1.js"
dist/index.js       9.09 kB │ map: 10.59 kB
$ node dist/index.js
bar called
```

为什么没有出错呢？这里有需要简单的了解下模块的编译产物的结构
m1 模块编译完是这样的

```javascript
// m1.js
__mako_require__.e(exports, {  // step 1
    foo: function() {
        return foo;
    },
    y: function() {
        return y;
    }
});
var _m2 = __mako_require__("m2.js"); // step 2
function y() {
    console.log("y called");
}
function foo() {
    _m2.bar();
}
```

m2 也有类似的结构

```javascript
__mako_require__.e(exports, { //step 3
    bar: function() {
        return bar;
    },
    x: function() {
        return x;
    }
});
var _m1 = __mako_require__("m1.js"); //step 4
function bar() {
    console.log("bar called");
}
function x() {
    _m1.y();
}
```

当我们引用 `foo` 的时候，JavaScript 引擎执行是这样的

+ 执行 step 1 在 m1 模块中，创建并注册一个 exports 对象，方便起见叫它 m1_namespace，里面定义了 `foo` 和 `y` 两个变量；“得益于” Javascript 函数定义的提升(hoist)逻辑, 这两个变量已经有值了。
+ 执行 step 2 创建或获取 m2_namespace, 但是 m2_namespace 还不存在，就进入`m2.js` 执行创建逻辑
+ 执行 step 3 创建 m2_namespace, 里面注册了 `bar` 和 `x`，得“益于” Javascript 函数定义的提升，它们也是有值的。
+ 执行 step 4: 创建或获取 m1_namespace, 因为 m1_namespace 已经创建，就直接返回 m1_namespace，赋值给 `_m1`
+ 之后 m2 文件执行结束，回到 step 2，拿到 m1_namespace
+ m1 文件顺利执行结束

执行顺序是讲起来非常的拗口，上面这么复杂的执行逻辑可以用代码合并的方式来简化，即在 m1 文件中合并进m2 文件；当在 m2 文件合并进 m1 时，因为 m1 在上下文中已经存在就不用合并了，合并完成，最终代码类似如下。

```javascript
// import {bar} from "./m2" 合并进以下代码
export function bar(){
  console.log("bar called")
}
export function x(){
  y()
}

// m1 原本的代码
export function y() {
  console.log("y called")
}
export function foo(){
  bar()
}

```

最后`foo`自然能正常调用执行。

至此我们可以有下面的结论：

1. 不经意的不合理的模块划分容易形成循环依赖
2. 提升机制（hoisting）让循环依赖能拿到正确的值，运行时不会报错。

### 会出现 undefined 的循环依赖
那我们来看另外一个 case

```javascript
import { bar } from "./m2";
export var y = "theY";
export var foo = "foo + " + bar;
```

```javascript
import { y } from "./m1";
export var bar = "bar + " + y;
export var x = "theX " + y;
```

大家可以猜猜，打印 `foo` 结果是啥？
我们用上面合并代码的方式来分析这个循环依赖，得到这样的代码：

```javascript
// import { bar } from "./m2" 的合并展开
export var bar = "bar + " + y;
export var x = "theX " + y;

// m1.js 原本代码
export var y = "theY";
export var foo = "foo + " + bar;
```

在 `bar`变量定义的时候，`y`变量因为提升( hoist ) 当前值是 `undefined`，所以 `bar`值为`"bar + undefined"`, 那么 最终的 `foo` 的值 `"foo + bar + undefined"`

实际运行：

```plain
Building with mako for development...
Warning Circular Dependencies: "case2/m1.js" -> "case2/m2.js" -> "case2/m1.js"
dist/index.js       9.66 kB │ map: 10.77 kB
✓ Built in 69ms
$ node dist/index.js
case2 foo + bar + undefined
```

所以一样是因为提升，这次就在循环依赖的模块中出现了 bug，示例中只是两个模块形成的循环依赖，如果由更多的模块形成更大的循环，要查出这个问题就没有这么容易了。

### 再来个报错的循环依赖
```javascript
import { bar } from "./m2";
export const y = "theY";
export var foo = "foo + " + bar;
```

```javascript
import { y } from "./m1";
export var bar = "bar + " + y;
export var x = "theX " + y;
```

直接看执行结果

```bash
Building with mako for development...
LoopDetected: "case3/m1.js" -> "case3/m2.js" -> "case3/m1.js"
dist/index.js       9.71 kB │ map: 10.84 kB
✓ Built in 67ms
Complete!
$ node dist/index.js
/demo/dist/index.js:31
                    return y;
                    ^
ReferenceError: Cannot access 'y' before initialization
```

继续用“合并”法分析下

```javascript
// import { bar } from "./m2" 的合并展开
// y 的 临时死区起始点
export var bar = "bar + " + y;
export var x = "theX " + y;

// m1.js 原本代码
// y 的 临时死区起结束
export const y = "theY";
export var foo = "foo + " + bar;
```

由于这里 `y`变量使用 `const`定义，那么形成了一个暂时性死区( [TDZ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let#%E6%9A%82%E6%97%B6%E6%80%A7%E6%AD%BB%E5%8C%BA))，`bar`在 `y`的死区中访问`y`,自然就报错了。这就是某些循环依赖会报错的原因了。

至此，我们总结下

1. 如果循环依赖的相互引用的函数，因为函数的提升，循环依赖不会报错。
2. 如果循环依赖的是`var` 变量，因为抬升 (hoist),  循环依赖里面会出现 `undefined` 的现象。
3. 因为 `const/let` 的 _TDZ_ ，循环依赖里面就会有 `Cannot access before initialization` 的报错

所以循环依赖要不就没有错误，要不就是运行时错误。所以它就是代码中一个隐藏的炸弹，一个不经意的新增 `export/import` 形成了循环依赖，就很有容易流到生产环境中去。前置发现循环依赖并解决就很要必要。

## Mako 来帮你发现循环依赖
Mako 内置了循环依赖检测功能，默认已经开启，构建时会打印出项目中所有的循环依赖。

```text
Warning Circular Dependencies: "case1/m1.js" -> "case1/m2.js" -> "case1/m1.js"
Warning Circular Dependencies: "case2/m1.js" -> "case2/m2.js" -> "case2/m1.js"
Warning Circular Dependencies: "case3/m1.js" -> "case3/m2.js" -> "case3/m1.js"
```

+ 默认配置会过滤掉包含 `node_modules` 的环，可以通过配置开启了；因为 node_modules 下的模块形成的环实在太多了。
+ 支持生成 graphviz dot 文件，用于可视化的分析循环依赖的情况

### 如何配置
Umi 在开启 Mako 后，默认开启循环依赖检测功能；如果你直接使用 `@umijs/mako` 的需要增加配置项。

```json
{
  "experimental": {
    "detectCircularDependence": {
      "ignores": ["node_modules"], // 需要忽略的循环依赖正则表达，默认配置 ["node_modules"]
      "graphviz": false
    }
  }
}
```
