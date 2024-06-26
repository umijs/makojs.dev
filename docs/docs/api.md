---
title: Mako - API
---

# API

Mako API could be used to build and watch your project programmatically. Use it when you need more flexibility than the CLI provides, or to integrate Mako into your own toolchain.

## Build

First, install `@umijs/mako`:

```bash
$ npm i @umijs/mako
```

Then, use the `build` function to build your project:

```ts
const { build } = require('@umijs/mako');
await build({
  root: process.cwd(),
  watch: false,
  config: {},
});
```

### Options

#### root

- Type: `String`
- Default: `process.cwd()`

The root directory of the project.

#### config

- Type: `Object`
- Default: `{}`

Checkout [config](./config) for more details.

#### watch

- Type: `Boolean`
- Default: `false`

When enabled, Mako will watch for file changes and recompile automatically.

