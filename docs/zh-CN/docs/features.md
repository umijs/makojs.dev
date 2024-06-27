---
title: Mako - Features
translated_at: '2024-06-26T13:23:11.573Z'
---

# 特性

## 开箱即用

只需开始一个 JS/TS 文件，Mako 将处理剩下的一切。TypeScript、Less、CSS、CSS 模块、React、图片、字体、WASM、Node Polyfill 等都支持开箱即用。无需配置加载器、插件或其他任何东西。

但是，一切都是可配置的。如果你有 Mako 不支持的文件类型，你可以为它添加一个带加载器的插件。

## 生产级

Mako 是可靠的。它在蚂蚁集团的数百个项目中得到了应用，如 Web App、Hybrid App、小程序（部分）、低代码、无服务器、库开发、[Ant Design](https://ant.design/) 等。我们进行了大量的测试和基准测试来确保 Mako 的质量。我们还在成千上万的旧项目中测试了 Mako，以及数千个 npm 包及其不同版本，以确保兼容性。

![](https://res.cloudinary.com/sorrycc/image/upload/v1719198069/blog/neqp18f8.png)

## 极快

Mako 设计之初就是为了速度。我们使用 Rust 来处理核心打包逻辑，并使用 Node.js 中的 [piscina](https://www.npmjs.com/package/piscina) 来并行编译文件。我们花了很多时间优化 Mako 的性能。而且，Mako 在基准测试用例中比其他 Rust 打包器和 Webpack 更快。

![](https://res.cloudinary.com/sorrycc/image/upload/v1717062514/blog/smnzhuk1.png)

查看 [《聊下 Mako 的 Benchmark》](/blog/benchmark) 和 [基准测试仓库](https://github.com/umijs/benchmark) 了解更多详情。

## 模块热替换

当文件发生变化时，Mako 将自动在浏览器中更新你的代码。无需手动刷新页面。

而且，Mako 已集成 React Fast Refresh，当你更改一个 React 组件时，它只会更新组件，而不是整个页面。

![](https://res.cloudinary.com/sorrycc/image/upload/v1718937230/blog/o0dt1fuf.gif)

在完整的 ant-design-pro 项目中的 HMR：Webpack（上）vs Mako（下）。

## 诊断

Mako 内置了一个诊断系统，将在终端显示错误和警告。（WIP：在未来的版本中，在浏览器中也会显示。）

当你的代码出现错误时，Mako 会显示精美的诊断信息。每个错误都包括一个代码框，向你展示错误的上下文环境。很多错误还包括了如何修复错误的建议。

![](https://res.cloudinary.com/sorrycc/image/upload/v1718937775/blog/ovcrajw0.png)

## TypeScript

TypeScript 支持开箱即用。Mako 会自动将你的 TypeScript 文件编译为 JavaScript。

这里有一些你可能想知道的事情：

- 不支持 `const enum`，你应该使用 `enum` 代替。因为 `const enum` 需要解析整个项目，而在 Mako 中，我们逐个单独编译文件。
- Mako 不会生成类型声明。如果你想要这么做，使用 `tsc --noEmit` 代替。
- Mako 默认不检查类型。如果你想要这么做，在配置中将 [`forkTsChecker`](./config#forktschecker) 设置为 true，或者使用 `tsc` 代替。
- Mako 不解析你的 `tsconfig.json` 文件。如果你想启用像 [`useDefineForClassFields`](./config#usedefineforclassfields) 这样的功能，你应该在配置中设置。

## Less

Less 支持开箱即用。Mako 会自动将你的 Less 文件编译为 CSS。

由于蚂蚁集团大量使用 Less，Mako 在此方面进行了优化。我们在 Node.js 中使用 [piscina](https://www.npmjs.com/package/piscina) 的 workers 并行编译 less 文件，这可以加速编译过程。因此，默认情况下，它比其他 rust 打包工具在这个方面更快。更多详情请查看 [《Node 多线程的魔力 - Mako 中的 Less 并行编译》](/blog/parallel-less-loader)。

![](https://res.cloudinary.com/sorrycc/image/upload/v1715149825/blog/him5ls7i.png)

这里有一些你可能想知道的事情：

- Mako 的 `alias` 配置应该能够正确地与 Less 文件一起工作。
- 如果你想使用 Less 插件，或修改主题变量，或启用数学功能，请在配置中用 [`less`](./config#less) 字段指定它们。

## CSS Modules

默认情况下，以 `.module.css` 或 `.module.less` 结尾的文件将被视为 CSS 模块。你可以这样导入它们：

```css
/* styles.module.css */
.container {
  color: red;
}
```

```js
import styles from './styles.module.css';
console.log(styles.container); // styles.container 将是一个字符串
```

还有一些你可能想知道的事情：

- Mako 有一个 [`autoCSSModules`](./config#autocssmodules) 配置项。如果未启用，只有 `.module.css` 或 `.module.less` 的文件会被视为 CSS Modules；如果启用了，像 `import styles from './a.css'` 这样的命名导入也会被视为 CSS Modules。

## SVG 作为 React 组件

你可以将 SVG 文件导入为 React 组件。Mako 会自动优化 SVG 文件，并将它们转换为 React 组件。

```js
import { ReactComponent as Logo } from './logo.svg';
```

## CLI

Mako 有一个简单的内置 CLI，你可以使用它来启动开发服务器，构建项目等。目前它只有一个 `build` 命令，将来可能会添加更多命令。

```bash
$ npm i @umijs/mako -D
$ npx mako -h

Mako vX.X.X

Usage: mako <command> [options]

Commands:
  build

Options:
  --help,-h
  --version,-v

Examples:
  mako build
  mako -v
```

如果你想在开发中使用 Mako，可以在 build 命令中添加 `--watch` 参数。查看 `npx mako build -h` 获取更多详情。

```bash
$ npx mako build --watch
```

建议在你的框架或工具中使用 Mako 的 API，就像 [Umi](https://github.com/umijs/umi) [所做的](https://github.com/umijs/mako/tree/master/packages/bundler-mako)。

```ts
const { build } = require('@umijs/mako');
await build({
  root: process.cwd(),
  watch: false,
  config: {},
});
```

## 插件

> 注意：插件系统仍在开发中，API 未来可能会改变。

插件是可以修改 Mako 行为的 JavaScript 对象。它们可以添加新功能，修改现有功能，甚至删除功能。

```ts
{
  name?: string;
  buildStart?: () => void;
  generateEnd?: (data: {
    isFirstCompile: boolean;
    time: number;
    stats: {
      startTime: number;
      endTime: number;
    };
  }) => void;
  load?: (filePath: string) => Promise<{ content: string, type: 'css'|'js'|'jsx'|'ts'|'tsx' }>;
}
```

如果你想在你的项目中使用插件，你可以将它们添加到配置中的 `plugins` 字段。

```ts
{
  plugins: [
    require.resolve('./my-plugin'),
  ],
}
```

## Code Splitting

Mako 内置了对代码拆分的支持。你可以使用动态导入来将代码拆分成不同的包。这样可以减小初始包的大小并加快加载时间。

```js
import('./module').then(module => {
  console.log(module);
});
```

Mako 有一个 [`codeSplitting`](./config#codesplitting) 配置，你可以用它来自定义代码拆分的行为。我们有三种代码拆分策略：

- `auto`：Mako 会基于模块的大小自动拆分代码。
- `granular`：更细粒度的代码拆分，在生产环境中建议使用。
- `advanced`：如果你想自定义代码拆分的行为，你可以使用这种策略。

> 注意：没有银弹解决方案对于代码拆分，你应该基于你的项目选择策略。

还有一件事你可能想知道：

- 有些情况下你可能想在构建后只保留一个 js 文件和一个 css 文件，你可以使用 [`dynamicImportToRequire`](./config#dynamicimporttorequire) 配置将动态导入转换为 require。

## Tree Shaking

树摇是一种通过分析 JavaScript 模块之间的导入/导出关系来消除死代码的技术。在 Mako 中，树摇功能在生产构建中默认启用，在观察模式下禁用。更多信息关于树摇，参考我们的[博客](/blog/mako-tree-shaking)。

除了移除模块间的死代码，Mako 引入了一个名为 “[skipModules](./config#optimization)” 的功能来消除多余的模块。如果一个模块的导出变量通过一些无副作用的模块导入，这个功能允许导入模块绕过中间模块直接导入。

![skipModules-demo](https://mdn.alipayobjects.com/huamei_42epzw/afts/img/A*r0UkT5JzuGQAAAAAAAAAAAAADiSRAQ/original)

## Module Concatenation

[Module Concatenation](./config#optimization) 是一项旨在减少包大小和运行时开销的优化功能。它等同于 [Webpack 优化文档](https://webpack.js.org/configuration/optimization/#optimizationconcatenatemodules) 中的实现。

该功能识别出一组模块，这些模块仅依赖于同组中的模块，并将每个组合并成一个模块。


## Targets

Mako 有一个 [`targets`](./config#targets) 配置，您可以用它来指定您想要支持的浏览器。Mako 将自动编译您的代码以兼容指定的浏览器，包括注入 ~~polyfills~~（尚未实现）、助手等。

```js
{
  targets: {
    chrome: 40,
    ie: 11,
  },
}
```

当您想为 node 构建时，您还应该在配置中将 [`platform`](./config#platform) 设置为 `node` 并将 [`dynamicImportToRequire`](./config#dynamicimporttorequire) 设置为 true。（为什么需要将 `dynamicImportToRequire` 设为 true？因为运行时尚未支持 node 风格的块加载。）

```js
{
  platform: 'node',
  dynamicImportToRequire: true,
}
```

注意：当 `platform` 设置为 `'node'` 时，Mako 将忽略所有 Node.js 内建模块（如 `fs`、`path`、`http` 等），以保持原始的 require 表达式。

## Node Polyfill

当 `platform` 未设置或设置为 `'browser'` 时，Mako 将自动向您的代码注入 Node.js polyfill。此 polyfill 包括所有 Node.js 内建模块（如 `fs`、`path`、`http` 等）和全局对象（如 `process`、`Buffer` 等）。并且在开发模式下 `process.env.NODE_ENV` 将被设置为 `'development'`，在生产模式下被设置为 `'production'`。

原生 Node.js 模块 polyfill 基于 [node-libs-browser-okam](https://github.com/sorrycc/node-libs-browser-okam)，该项目是从 [node-libs-browser](https://github.com/webpack/node-libs-browser) 分叉出来的。如果您对哪个 polyfill 是针对哪个模块感兴趣，可以查看 [源代码](https://github.com/sorrycc/node-libs-browser-okam/blob/master/index.js)。

## 代码分析

Mako 内置了一个基本的代码分析系统，可以显示您的代码大小以及每个模块的大小。通过在配置中设置 [`analyze`](./config#analyze) 来启用。

```js
{
  analyze: {},
}
```

输出将会是这样的：

![](https://res.cloudinary.com/sorrycc/image/upload/v1718973387/blog/yoo60fny.png)

## RSC

Mako 支持内置的 RSC（React 服务器组件），但目前仍是实验性的，且未针对通用使用进行优化。它已在支付宝 App 中的页面如 618 活动、优惠券、蚂蚁森林等中使用过。

Mako 对于 RSC 有两个配置：

- [`rscServer`](./config#rscserver)：RSC 服务器端配置。
- [`rscClient`](./config#rscclient)：RSC 客户端配置。

您可以在 [examples/rsc](https://github.com/umijs/mako/tree/master/examples/rsc) 中找到一个简单的示例。

> 注意：RSC 是复杂的，且 Mako 中的 RSC 支持仍是实验性的，除非你知道自己在做什么，否则不建议在你的项目中使用它。

## Umi 集成

[Umi](https://github.com/umijs/umi) 是一个流行的 React 框架。Mako 设计为与 Umi 兼容，您可以在 Umi 4 中仅通过在配置中设置 `mako` 字段，来使用 Mako 作为打包器。

```diff
{
+   mako: {},
}
```

更多详情请查看 [与 Umi 结合使用](./getting-started#bundle-with-umi)。

## 库

建议使用 [father](https://github.com/umijs/father)，它基于 Mako 用于打包库。
