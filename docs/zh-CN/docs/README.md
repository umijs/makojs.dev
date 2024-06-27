---
title: Mako - Extremely fast, Production-grade web bundler
translated_at: '2024-06-26T13:24:50.773Z'
---

# Mako

<img src="https://img.alicdn.com/imgextra/i4/O1CN01dvFN0j1e2rYBJpJGJ_!!6000000003814-2-tps-2048-2048.png" width="120" height="120" />

> 🚧 施工中！<br />
> Mako 仍在积极开发中，尚未准备好用于生产环境。<br />
> **我们 2024 年 6 月见！**

## Mako 是什么？

Mako `['mɑːkoʊ]` 是一个基于 **Rust** 的**极速**、**生产级**网页打包器。

查看 [入门指南](./getting-started) 来试用 mako 吧。

## 基准测试

![](https://res.cloudinary.com/sorrycc/image/upload/v1717062514/blog/smnzhuk1.png)

查看 [基准测试](./blog/benchmark) 了解更多详情。

## 主要特性

- **极速**，Mako 采用 Rust 构建，Rust 以其性能和安全性而闻名。Mako 利用了[数据并行](https://crates.io/crates/rayon)和[缓存](https://crates.io/crates/cached)功能来提供快速有效的打包服务。
- **生产级**，Mako 已在蚂蚁集团的数百个项目中投入生产使用。我们已在数千个项目中进行了测试，证明它是可靠且稳定的。
- **易于使用**，Mako 设计之初就是易于使用。从零配置开始，并根据需要进行自定义。Mako 也兼容现有的框架，如 umi。
