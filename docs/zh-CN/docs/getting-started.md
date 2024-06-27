---
title: Mako - Getting Started
translated_at: '2024-06-26T13:22:23.767Z'
---

# 开始上手

## 安装 Mako

通过 npm 或 pnpm 安装 Mako。

```bash
$ npm i @umijs/mako -D
```

然后你可以通过 npx 运行 Mako。

```bash
$ npx mako -v
```

## 你的第一个包

创建一个新目录并添加一个简单的 `index.ts` 文件。

```bash
$ mkdir my-app && cd my-app
$ mkdir src
$ echo "console.log('Hello Mako!')" > src/index.ts
```

然后运行 Mako 来构建包。

```bash
$ npx mako build
Building with mako for development...
dist/index.js       7.04 kB │ map: 8.87 kB
✓ Built in 20ms
Complete!
```

最后，运行包以查看输出。

```bash
$ node dist/index.js
Hello Mako!
```

## 与 React 打包

> 或者，你可以查看 CodeSandbox 示例。
> 
> [![Edit mako](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/mako-jzhkjh?embed=1&file=%2Fsrc%2FApp.tsx)

用以下命令创建一个新的 Mako 项目。

```bash
$ npm create mako
```

然后进入项目目录并运行。

```bash
$ cd mako-project
$ npm run dev
Building with mako for development...
✓ Built in 101ms
```

打开浏览器并访问 http://localhost:3000 来查看输出。

![](https://res.cloudinary.com/sorrycc/image/upload/v1715740987/blog/hlufbyzp.png)

最后，如果你想为生产环境构建项目，请运行以下命令。

```bash
$ npm run build
Building with mako for production...
dist/index.js       144.68 kB │ map: 354.22 kB
✓ Built in 96ms
Complete!
```

## 与 Umi 打包

最新的 Umi 默认支持 Mako。你可以通过在配置文件中设置 `mako` 字段，在 Umi 项目中启用 Mako。

首先，确保你安装了 umi@4.2.0 或更高版本。

```bash
$ npx umi -v
4.2.0
```

然后，在你的配置文件中添加 `mako` 字段。

```bash
$ npx umi config set mako {}
```

这将在 `.umirc.ts` 或 `config/config.ts` 中生成以下配置。

```diff
export default {
+   mako: {},
};
```

现在你可以用 Mako 运行 Umi 项目了。

```bash
$ umi build
info  - [plugin: @umijs/preset-umi/dist/features/mako/mako] Using mako@0.4.15
warn  - [plugin: @umijs/preset-umi/dist/features/mako/mako] Mako is an extremely fast, production-grade web bundler based on Rust. And it's still under active development and is not yet ready for production use. If you encounter any issues, please checkout https://makojs.dev/ to join the community and report the issue.
info  - Umi v4.2.0
info  - Preparing...
Building with mako for production...
dist/umi.css         0.07 kB │ map: 0.19 kB
dist/umi.js        696.36 kB │ map: 1.33 mB
✓ Built in 314ms
Complete!
info  - Memory Usage: 120.76 MB (RSS: 413.55 MB)
event - Build index.html
```
