---
title: Mako - Why Mako
translated_at: '2024-06-26T13:21:50.864Z'
---

# 为什么选择 Mako

> 我们为什么构建 Mako，以及你为什么应该使用它。

## 我们为什么构建 Mako？

我们在蚂蚁金服已经使用了 Webpack 数年，我们见识到了 Webpack 的痛点，其中最大的一个就是性能问题。我们尝试过优化 Webpack，比如 [MFSU](https://umijs.org/blog/mfsu-faster-than-vite) 等，但是很难在 Webpack 本身做出大的改变，而且 JavaScript 不是最适合性能的语言。所以我们决定从零开始用 Rust 构建一个新工具，以彻底解决这个问题，那就是 [Mako](https://makojs.dev/)。

在 Mako 之前，我们对市场上所有的 Rust 打包工具进行了调研，像 [Farm](https://www.farmfe.org/)、[Rspack](https://github.com/web-infra-dev/rspack)、[Turbopack](https://turbo.build/pack)、[Swc Bundler](https://swc.rs/docs/configuration/bundling) 等等。我们发现它们都很好，但都不完美地适合我们的使用场景。我们不需要完全兼容 Webpack，我们只需要一个更快的。而且我们有很多来自蚂蚁金服的特殊需求。所以我们决定从零开始构建 Mako。

Mako 设计得更快。我们从 Rust 打包器和 webpack 中学到了很多，但它与 Webpack 的社区加载器和插件不兼容。它旨在成为一个更有见解和一体化的解决方案。

## 你为什么应该使用 Mako？

使用 Mako 的一些理由包括：

- 性能
- 可靠性
- 零配置
- Umi 集成

Mako 非常快。请查看 [极速特性](./features#blazing-fast)、[《聊下 Mako 的 Benchmark》](/blog/benchmark) 和 [Benchmark 仓库](https://github.com/umijs/benchmark) 获取更多详情。

Mako 非常可靠。它已在蚂蚁金服的数百个项目中使用，如中后台、H5、小程序（部分）、低代码、无服务器、库开发、[Ant Design](https://ant.design/) 等等。我们进行了大量的测试和基准测试来确保 Mako 的质量。我们还在成千上万的旧项目中测试了 Mako，以及成千上万的 npm 包及其不同版本，以确保兼容性。

Mako 是零配置且有自己的想法。你不需要编写很多配置文件，只需运行 `mako build`，它就会工作。对于常见的用例，你不需要额外的插件和加载器。它旨在成为一个更有主见和集成的解决方案。

Mako 集成了 [Umi](https://umijs.org/)。如果你正在使用 Umi、[Father](https://github.com/umijs/father) 或 [Dumi](https://d.umijs.org/)，你只需添加一个配置项，就可以直接使用 Mako。

## 你什么时候不应该使用 Mako？

有一些原因不建议使用 Mako：

- Webpack 兼容性
- 可扩展性（暂时的）

Mako 不是为了与 Webpack 的社区加载器和插件兼容而设计的。如果你的项目严重依赖于 Webpack 的社区加载器和插件，你不应该使用 Mako，Rspack 是更好的选择。

可扩展性。Mako 的插件系统仍然处于工作进展中且简单。如果你需要许多自定义的插件和加载器，你不应该使用 Mako，Farm 和 Rspack 是更好的选择。但这是暂时的，我们将在未来改进插件系统。
