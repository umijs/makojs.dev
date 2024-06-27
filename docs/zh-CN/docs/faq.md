---
title: Mako - FAQ
translated_at: '2024-06-26T13:23:28.132Z'
---

# FAQ

以下是关于 Mako 的一些常见问题。你也可以在 [Github 或 Group](./feedback) 上提问。

## 我应该使用 Mako 吗？

请注意，Mako 仍处于实验阶段，尚未开源。虽然它已在蚂蚁金融的数百个项目中使用，但如果你想在生产环境的项目中使用它，你应该意识到相关风险。

## Mako 支持 Windows 吗？

尚未支持。Mako 目前仅支持 MacOS 和 Linux。开源发布后计划支持 Windows。

## 开源

Mako 计划在 2024 年 6 月底前开源。

## Webpack 兼容性

Mako 不旨在与 Webpack 的社区加载器和插件兼容。它旨在成为一个更具主观性和集成性的解决方案。如果你有一个想要与 Mako 一起使用的 Webpack 插件，你可以尝试将其移植到 Mako。

已知的不兼容性：

- [monaco-editor](https://github.com/microsoft/monaco-editor) 与 monaco-editor-webpack-plugin 不兼容，后者与 Mako 不兼容。可以尝试使用 [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)，在生产环境下更简单、更快。

## html-webpack-plugin 兼容性

Mako 不支持 html-webpack-plugin，并且不处理 html 文件。如果你想生成 html 文件，你应该手动操作。在 `mako.config.js` 中添加 [`stats`](./config#stats) 配置，然后你可以获取构建的信息，并可以编写你自己的 html 文件。

```js
{
  stats: {
  },
}
```
