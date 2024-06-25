---
title: Mako - Getting Started
---

# Getting Started

## Install mako

Install Mako via npm or pnpm.

```bash
$ npm i @umijs/mako -D
```

Then you can run Mako via npx.

```bash
$ npx mako -v
```

## Your first bundle

Create a new directory and add a simple `index.ts` file.

```bash
$ mkdir my-app && cd my-app
$ mkdir src
$ echo "console.log('Hello Mako!')" > src/index.ts
```

Then run Mako to build the bundle.

```bash
$ npx mako build
Building with mako for development...
dist/index.js       7.04 kB │ map: 8.87 kB
✓ Built in 20ms
Complete!
```

Finally, run the bundle to see the output.

```bash
$ node dist/index.js
Hello Mako!
```

## Bundle with react

> Or, you can checkout the codesandbox example.
> 
> [![Edit mako](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/devbox/mako-jzhkjh?embed=1&file=%2Fsrc%2FApp.tsx)

Create a new mako project with the following command.

```bash
$ npm create mako
```

Then cd into the project directory and run.

```bash
$ cd mako-project
$ npm run dev
Building with mako for development...
✓ Built in 101ms
```

Open the browser and visit http://localhost:3000 to see the output.

![](https://res.cloudinary.com/sorrycc/image/upload/v1715740987/blog/hlufbyzp.png)

Finally, if you want to build the project for production, run the following command.

```bash
$ npm run build
Building with mako for production...
dist/index.js       144.68 kB │ map: 354.22 kB
✓ Built in 96ms
Complete!
```

## Bundle with umi

The latest umi supports Mako out of the box. You can enable mako in umi project by setting the `mako` field in the config file.

First, make sure you have umi@4.2.0 or above installed.

```bash
$ npx umi -v
4.2.0
```

Then, add the `mako` field in your config file.

```bash
$ npx umi config set mako {}
```

Which will generate the following config in `.umirc.ts` or `config/config.ts`.

```diff
export default {
+   mako: {},
};
```

Now you can run the umi project with Mako.

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
