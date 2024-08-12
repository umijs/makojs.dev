---
title: Mako - 聊下 Mako 的 Benchmark
publishedAt: 2024-06-03 00:00:00
authors:
  - name: sorrycc
    link: https://github.com/sorrycc
---

# 聊下 Mako 的 Benchmark

_2024-06-03 by [sorrycc](https://github.com/sorrycc)_

<img src="https://img.alicdn.com/imgextra/i4/O1CN01dvFN0j1e2rYBJpJGJ_!!6000000003814-2-tps-2048-2048.png" width="120" height="120" />

朋友们，大家好！有些同学对 Mako 的 Benchmark 感兴趣，今天就先把 Benchmark 仓库公开了。

近期 Mako 正式内测，内测前我们整理了 Benchmark 仓库，基于 https://github.com/farm-fe/performance-compare 重新写了下，加了一些维度，比如 js 尺寸用于比较产物的 Tree Shaking 效果。仓库地址是 https://github.com/umijs/benchmark 。

**1、先看 Benchmark 结果。**

跑的项目是大家都在跑的 Turbopack 测试项目，跑在 M2 Pro Max 电脑上。包含维度有 dev 冷启动时间、根节点和叶子节点的 HMR 时间、生产 Build 构建时间和 JS 产物尺寸。

![](https://img.alicdn.com/imgextra/i4/O1CN01PrzecB1WONFfL2K60_!!6000000002778-2-tps-2018-340.png)

如果大家感兴趣，可以手动 clone 仓库跑跑看。

```bash
git clone git@github.com:umijs/benchmark.git
cd benchmark
pnpm i
pnpm run setup
pnpm benchmark
```

注：Farm 使用 API 的方式[没有尝试成功](https://github.com/umijs/benchmark/issues/1)，所以没有生成 HMR 数据；RsBuild 升级 0.7 [遇到点问题](https://github.com/umijs/benchmark/issues/8)，所以目前还是 0.6。欢迎 PR！

**2、Benchmark 的实现。**

1）Build 速度和 JS 尺寸。没啥好说的，多跑几遍，然后算平均值就好。

2）Dev 启动速度。由于 Vite 等工具按需编译功能的存在，除了要启动各个工具的 dev 命令，还需要用 puppteer 打开浏览器等 load 完成才算完，比如 Vite 这种 Bundless 的编译方式，是需要等请求过去之后才会做编译的。

3）热更速度区分了 Root 和 Leaf。这应该和部分构建工具的实现有关，而在 Mako 里，Root 和 Leaf 的变更时间基本是一致的。热更的测量是往文件里 appendFileSync 一句 console.log，比如 `console.log('root hmr')`，然后用 `page.waitForEvent` 等 console 内容包含 root hmr 的事件，这样就能算出代码从改动开始到在浏览器里执行的时间差了。

4）需要注意的是，有些构建工具会有缓存机制，每次跑之前需要清空缓存文件。

**3、我对 Benchmark 的理解。**

在这个数据里 Mako 都要好一点点，但 Benchmark 数据其实只能部分反应其在现实项目中的表现。真实项目是复杂的，比如 1 个 chunk 的项目和 100 个 chunk 的表现是不同的，1000 个模块的脚手架项目和 20000+ 模块的巨型项目也是不同的。

Benchmark 本身是客观的，但 Benchmark 啥和怎么 Benchmark 是主观的。比如这个测试项目，如果 Mako 的数据不太理想，你问我要不要换个项目，我估计会犹豫一下。同时各个 Bundle 工具的优缺点不同，比如 Mako，缺点是 Tree Shaking 还没做并发、没做物理缓存、没做按需编译等，优点是有做 Chunk 生成的并发、Less 编译的并发、类 MFSU 的提速方案等。所以，假如我们做一个满是 Less 的项目，那 Mako 的数据就会很好看。

![](https://img.alicdn.com/imgextra/i1/O1CN01e2cgvj1IhEwdj0Qrh_!!6000000000924-2-tps-1976-216.png)

```bash
pnpm benchmark --tools mako,rsbuild --project projects/lots-of-less
```

Benchmark 数据也和大家做的功能多少和完善度有关，比如 react 和 preact，虽然都能跑 jsx，但功能是不一样的。当然，Mako 没 preact 那么简单。。但是，Mako 目前还没在 dev 阶段做 Tree Shaking，这应该也是数据好的小部分原因。

**4、One More Thing：SSU。**

Mako 还有个试验性的 SSU 功能，类似之前的 MFSU 实现，会做依赖的打包和缓存。根据源码和依赖比的不同，可实现 Dev 热启动的 10-50 倍提速。

![](https://img.alicdn.com/imgextra/i1/O1CN01B0hTND1NI7IVs2zDh_!!6000000001546-2-tps-2198-852.png)

```bash
SSU=true pnpm --filter @example/with-antd bundler mako dev
```
