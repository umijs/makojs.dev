---
title: Mako - Extremely fast, Production-grade web bundler
---

# Mako

<img src="https://img.alicdn.com/imgextra/i4/O1CN01dvFN0j1e2rYBJpJGJ_!!6000000003814-2-tps-2048-2048.png" width="120" height="120" />

> 🚧 Work in Progress!<br />
> Mako is still under active development and is not yet ready for production use.<br />
> **See you in June 2024!**

## What is Mako?

Mako `['mɑːkoʊ]` is an **extremely fast**, **production-grade** web bundler based on **Rust**.

Check out the [Getting Started](./getting-started) to give mako a try.

## Benchmark

![](https://res.cloudinary.com/sorrycc/image/upload/v1717062514/blog/smnzhuk1.png)

Check out the [Benchmark](./blog/benchmark) for more details.

## Main Features

- **Extremely fast**, Mako is built in Rust, which is known for its performance and safety. Mako takes advantage of [data-parallelism](https://crates.io/crates/rayon) and [caching](https://crates.io/crates/cached) features to provide fast and efficient bundling.
- **Production-grade**, Mako is already in production use in hundreds of projects at Ant Group. And we have tested it in thousands of projects and it has proven to be reliable and stable.
- **Easy to use**, Mako is designed to be easy to use out of the box. Start with zero configuration and customize it as needed. Mako is also compatible with existing frameworks like umi.
