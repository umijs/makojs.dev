---
title: Mako - Features
---

# Features

## Zero Config

Start with a JS/TS file, and Mako will handle the rest. TypeScript, Less, CSS, CSS Modules, React, Images, Fonts, WASM, Node Polyfill and more are supported out of the box. No need to configure loaders, plugins, or anything else.

But, everything is configurable. If you have a file type that Mako doesn't support, you can add a plugin with loader for it.

## Production Grade

Mako is reliable. It's used in hundreds of projects at Ant Group, like Web App，Hybrid App, Mini Program (Partly), Low Code, Serverless, Library Development, [Ant Design](https://ant.design/) and others. We have a lot of tests and benchmarks to ensure the quality of Mako. We have also tested Mako in thousands of old projects, and thousands of npm packages and it's different versions to ensure the compatibility.

![](https://img.alicdn.com/imgextra/i1/O1CN017VwtQK22hfdt4p1zf_!!6000000007152-2-tps-1902-1062.png)

## Blazing Fast

Mako is designed to be blazing fast. We use Rust for the core bundling logic, and we use workers in Node.js with [piscina](https://www.npmjs.com/package/piscina) to compile files in parallel. We have spend lots of time optimizing the performance of Mako. And Mako is faster than other Rust bundlers and Webpack in benchmark case.

![](https://img.alicdn.com/imgextra/i4/O1CN01PrzecB1WONFfL2K60_!!6000000002778-2-tps-2018-340.png)

Check out [《聊下 Mako 的 Benchmark》](/blog/benchmark) and the [benchmark repo](https://github.com/umijs/benchmark) for more details.

## Hot Module Replacement

When files change, Mako will automatically update your code in the browser. No need to refresh the page manually.

And Mako has integrated React Fast Refresh, when you change a React component, it will only update the component, not the whole page.

![](https://img.alicdn.com/imgextra/i1/O1CN01hWz91Y25X5KsM9XPw_!!6000000007535-1-tps-1340-610.gif)

HMR in full ant-design-pro project: Webpack(above) vs Mako(below).

## Diagnostics

Mako has a built-in diagnostics system that will show you errors and warnings in the terminal. (WIP: And in the browser, in the future version.)

When you have an error in your code, Mako will show you beautiful diagnostics. Every error includes a code frame that shows you the context of the error. Many errors also include suggestions for how to fix the error.

![](https://img.alicdn.com/imgextra/i2/O1CN01wYKT2W1Gpp8V6XVU7_!!6000000000672-2-tps-2000-494.png)

## TypeScript

TypeScript is supported out of the box. Mako will automatically compile your TypeScript files to JavaScript.

And there're something you might want to know:

- `const enum` is not supported, you should use `enum` instead. Since `const enum` needs to parse the whole project, and in Mako, we transpile files one by one separately.
- Mako won't emit type declarations. If you want to do this, use `tsc --noEmit` instead.
- Mako won't check types by default. If you want to do this, set [`forkTsChecker`](./config#forktschecker) to true in the config, or use `tsc` instead.
- Mako don't parse your `tsconfig.json` file. If you want to enable features like [`useDefineForClassFields`](./config#usedefineforclassfields), you should set it in the config.

## Less

Less is supported out of the box. Mako will automatically compile your Less files to CSS.

Since less is used heavily in Ant Group, Mako has been optimized for this. We use workers in Node.js with [piscina](https://www.npmjs.com/package/piscina) to compile less files in parallel, which can speed up the compilation process. So, it's faster than other rust bundle tools in this case by default. Checkout [《Node 多线程的魔力 - Mako 中的 Less 并行编译》](/blog/parallel-less-loader) for more details.

![](https://img.alicdn.com/imgextra/i2/O1CN017hEGJT1NiDsCxNHVJ_!!6000000001603-2-tps-2074-372.png)

And there're something you might want to know:

- Mako's `alias` config should be work properly with Less files.
- If you want to use Less plugins, or modify theme vars, or enable maths, specify them in the config with [`less`](./config#less) field.

## CSS Modules

By default, files ending with `.module.css` or `.module.less` will be treated as CSS Modules. You can import them like this:

```css
/* styles.module.css */
.container {
  color: red;
}
```

```js
import styles from './styles.module.css';
console.log(styles.container); // styles.container will be a string
```

And there're something you might want to know:

- Mako has an [`autoCSSModules`](./config#autocssmodules) config. If not enabled, only files with `.module.css` or `.module.less` will be treated as CSS Modules; if enabled, named imports like `import styles from './a.css'` will also be treated as CSS Modules.

## SVG as React Component

You can import SVG files as React components. Mako will automatically optimize the SVG files and convert them to React components.

```js
import { ReactComponent as Logo } from './logo.svg';
```

## CLI

Mako has a simple built-in CLI that you can use to start a development server, build your project, and more. It only has a `build` command for now, and more commands might be added in the future.

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

If you want to use Mako in development, you can add the `--watch` parameter to the build command. Check `npx mako build -h` for more details.

```bash
$ npx mako build --watch
```

It's also suggested to use Mako with API in your framework or tool, like what [Umi](https://github.com/umijs/umi) [does](https://github.com/umijs/mako/tree/master/packages/bundler-mako).

```ts
const { build } = require('@umijs/mako');
await build({
  root: process.cwd(),
  watch: false,
  config: {},
});
```

## Plugins

> NOTICE: Plugin system is still under development, and the API may change in the future.

Plugins are JavaScript Objects that can modify the behavior of Mako. They can add new features, modify existing features, or even remove features.

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

If you want to use plugins in your project, you can add them to the `plugins` field in the config.

```ts
{
  plugins: [
    require.resolve('./my-plugin'),
  ],
}
```

## Code Splitting

Mako has built-in support for code splitting. You can use dynamic imports to split your code into separate bundles. Resulting in smaller initial bundle sizes and faster load times.

```js
import('./module').then(module => {
  console.log(module);
});
```

Mako has a [`codeSplitting`](./config#codesplitting) config that you can use to customize the behavior of code splitting. We have three strategies for code splitting:

- `auto`: Mako will automatically split your code based on the size of the module.
- `granular`: More granular code splitting, it's suggested to use this in production.
- `advanced`: If you want to customize the behavior of code splitting, you can use this strategy.

> Notice: There's no Silver Bullet for code splitting, you should choose the strategy based on your project.

One more thing you might want to know:

- Somethings you might want to keep only one js file and one css file after build, you can use [`dynamicImportToRequire`](./config#dynamicimporttorequire) config to transform dynamic imports to require.

## Tree Shaking

Tree shaking is a technique used to eliminate dead code by analyzing the import/export relationships between JavaScript modules. In Mako, the tree shaking feature is enabled by default in production builds and disabled in watch mode. For more information on tree shaking, refer to our [blog](/blog/mako-tree-shaking).

In addition to removing dead code between modules, Mako introduces a feature called “[skipModules](./config#optimization)” to eliminate redundant modules. If a module's exported variable is imported through some side-effect-free modules, this feature allows the importer module to bypass the intermediary modules and import it directly.

![skipModules-demo](https://mdn.alipayobjects.com/huamei_42epzw/afts/img/A*r0UkT5JzuGQAAAAAAAAAAAAADiSRAQ/original)

## Module Concatenation

[Module concatenation](./config#optimization) is an optimization feature designed to reduce both bundle size and runtime overhead. It is equivalent to the implementation found in [Webpack's optimization documentation](https://webpack.js.org/configuration/optimization/#optimizationconcatenatemodules).

This feature identifies groups of modules that are exclusively dependent on the modules in the same group and concatenates every groups into a single module respectively.


## Targets

Mako has a [`targets`](./config#targets) config that you can use to specify the browsers that you want to target. Mako will automatically compile your code to be compatible with the specified browsers, including injecting ~~polyfills~~(not yet), helpers and more.

```js
{
  targets: {
    chrome: 40,
    ie: 11,
  },
}
```

When you want to build for node, you should also set [`platform`](./config#platform) to `node` and [`dynamicImportToRequire`](./config#dynamicimporttorequire) to true in the config. (Why need to set `dynamicImportToRequire` to true? Because the runtime does not yet support node-style chunk loading.)

```js
{
  platform: 'node',
  dynamicImportToRequire: true,
}
```

Notice: When `platform` is set to `'node'`, Mako will ignore all Node.js built-in modules (like `fs`, `path`, `http`, etc.) to keep the origin require expression.

## Node Polyfill

When `platform` is not set or is set to `'browser'`, Mako will automatically inject a Node.js polyfill to your code. This polyfill includes all Node.js built-in modules (like `fs`, `path`, `http`, etc.) and global objects (like `process`, `Buffer`, etc.). And `process.env.NODE_ENV` will be set to `'development'` in development mode and `'production'` in production mode.

Native Node.js modules polyfill is based on [node-libs-browser-okam](https://github.com/sorrycc/node-libs-browser-okam) which is forked from [node-libs-browser](https://github.com/webpack/node-libs-browser). If you are curious about which polyfill is for which module, you can checkout [the source code](https://github.com/sorrycc/node-libs-browser-okam/blob/master/index.js).

## Code Analysis

Mako has a basic built-in code analysis system that will show you the size of your code and the size of each module. Enable it by setting [`analyze`](./config#analyze) in the config.

```js
{
  analyze: {},
}
```

The output will be like this:

![](https://img.alicdn.com/imgextra/i2/O1CN01eIGbjI1cadY6vqRNo_!!6000000003617-2-tps-3806-1718.png)

## RSC

Mako has a built-in RSC (React Server Components) support, but it's still experimental and not optimized for general usage. It has been used in pages in the Alipay App like 618 Activity, Voucher, Ant Forest, etc.

Mako has two config for RSC:

- [`rscServer`](./config#rscserver): Config for RSC server side.
- [`rscClient`](./config#rscclient): Config for RSC client side.

You can find a simple example in the [examples/rsc](https://github.com/umijs/mako/tree/master/examples/rsc).

> Notice: RSC is complex and RSC support in Mako is experimental, and it's not suggested to use it in your project unless you know what you are doing.

## Umi Integration

[Umi](https://github.com/umijs/umi) is a popular React framework. Mako is designed to be compatible with Umi, and you can use Mako as the bundler in Umi 4 by just setting the `mako` field in the config.

```diff
{
+   mako: {},
}
```

Checkout [Bundle with Umi](./getting-started#bundle-with-umi) for more details.

## Libraries

Suggest use [father](https://github.com/umijs/father), which is used to bundle libraries based on Mako.
