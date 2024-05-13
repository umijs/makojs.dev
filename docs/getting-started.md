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

Create a new directory and add a simple `index.tsx` file and `index.html` file.

```bash
$ mkdir my-app && cd my-app
$ mkdir src
$ cat <<EOF > src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
function App() {
  return <div>Hello Mako!</div>;
}
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
EOF
$ mkdir public
$ cat <<EOF > public/index.html
<div id="root"></div>
<script src="/index.js"></script>
EOF
```

Install the dependencies.

```bash
$ npm i @umijs/mako serve -D
$ npm i react react-dom -S
```

Then run Mako to build the bundle.

```bash
$ npx mako build --mode production
Building with mako for production...
dist/index.js       144.68 kB │ map: 354.14 kB
✓ Built in 96ms
Complete!
```

Finally, run the bundle to see the output.

```bash
$ npx serve ./dist
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
