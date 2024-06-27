---
title: Mako - Why Mako
---

# Why Mako

> Why we built Mako, and why you should use it.

## Why We Built Mako?

We have used Webpack for years in Ant Financial, and we have seen the pain points of Webpack, the biggest one is performance. We have tried to optimize Webpack like [MFSU](https://umijs.org/blog/mfsu-faster-than-vite) and others, but it's hard to make a big change in Webpack itself, and JavaScript is not the best language for performance. So we decided to build a new tool in Rust from scratch for a thorough solution, which is [Mako](https://makojs.dev/).

Before Mako, we have make a survey on all the Rust bundlers in the market, like [Farm](https://www.farmfe.org/), [Rspack](https://github.com/web-infra-dev/rspack), [Turbopack](https://turbo.build/pack), [Swc Bundler](https://swc.rs/docs/configuration/bundling) and others. We found that they are all good, but they are not perfect for our use case. We don't need to fully compatible with Webpack, we just need a faster one. And we have lot's of special requirements from Ant Financial. So we decided to build Mako from scratch.

Mako is designed to be faster. We have learned a lot from the Rust bundlers, and webpack, but it's not compatible with Webpack's community loaders and plugins. It's designed to be a more opinionated and integrated solution.

## Why You Should Use Mako?

There are some reasons to use Mako:

- Performance
- Reliability
- Zero Config
- Umi Integrated

Mako is fast. Please checkout the [Blazing Fast Feature](./features#blazing-fast), [《聊下 Mako 的 Benchmark》](/blog/benchmark) and the [Benchmark Repo](https://github.com/umijs/benchmark) for more details.

Mako is reliable. It's used in hundreds of projects at Ant Financial, like 中后台, H5, 小程序(Partly), Low Code, Serverless, Library Development, [Ant Design](https://ant.design/) and others. We have a lot of tests and benchmarks to ensure the quality of Mako. We have also tested Mako in thousands of old projects, and thousands of npm packages and it's different versions to ensure the compatibility.

Mako is Zero Config, and Opinionated. You don't need to write a lot of configuration files, just run `mako build` and it will work. You don't need extra plugins and loaders for common use cases. It's designed to be a more opinionated and integrated solution.

Mako is [Umi](https://umijs.org/) Integrated. If you're using Umi, [Father](https://github.com/umijs/father) or [Dumi](https://d.umijs.org/), you can use Mako out of the box with just adding a config item.

## When You Should Not Use Mako?

There are some reasons not to use Mako:

- Webpack Compatibility
- Extensibility (temporarily)

Mako is not designed to be compatible with Webpack's community loaders and plugins. If your project is heavily dependent on Webpack's community loaders and plugins, you should not use Mako, Rspack is a better choice.

Extensibility. Mako's plugin system is still Work In Progress and simple. If you need a lot of custom plugins and loaders, you should not use Mako, Farm and Rspack are better choices. But this is temporary, we will improve the plugin system in the future.

