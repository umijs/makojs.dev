---
title: Mako - API
translated_at: '2024-06-26T13:24:30.780Z'
---

# API

Mako API 可以用来以编程方式构建和监视你的项目。当你需要比 CLI 提供的更多灵活性，或者想要将 Mako 集成到自己的工具链中时，请使用它。

## Build

首先，安装 `@umijs/mako`：

```bash
$ npm i @umijs/mako
```

然后，使用 `build` 函数来构建你的项目：

```ts
const { build } = require('@umijs/mako');
await build({
  root: process.cwd(),
  watch: false,
  config: {},
});
```

### 选项

#### root

- 类型：`String`
- 默认值：`process.cwd()`

项目的根目录。

#### config

- 类型：`Object`
- 默认值：`{}`

查阅 [config](./config) 了解更多详情。

#### watch

- 类型：`Boolean`
- 默认值：`false`

当启用时，Mako 将监视文件变化并自动重新编译。
