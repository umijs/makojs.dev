---
title: Mako - Mako 内测了
publishedAt: 2024-05-14 00:00:00
authors:
  - name: sorrycc
    link: https://github.com/sorrycc
---

# Mako 内测了

_2024-05-14_

**WIP**

<img src="https://img.alicdn.com/imgextra/i2/O1CN01kdmA7X1FVqCPcRi3L_!!6000000000493-2-tps-584-584.png" width="120" height="120" />

Mako 是极快和生产级的前端构建工具，基于 Rust。Mako 去年上半年立项，下半年在蚂蚁集团内部正式发布，通过工程化的方式验证了数千个项目和 npm 包，已落地数百个项目，服务了中后台、小程序、低代码、营销等多个不同平台和业务场景。经过大量项目的实践和长时间的迭代，Mako 已经成熟，在速度和产物尺寸方面都已和社区的 Rust 构建方案齐平或实现超越，现在我们决定**在开源之前先做一轮内测来收集更多的反馈**。

![](https://res.cloudinary.com/sorrycc/image/upload/v1715149117/blog/jwr37qnh.png)

<p style="text-align:center;">Benchmark 基于 <a href="https://github.com/farm-fe/performance-compare">performance-compare</a>，相关仓库会随 Mako 一起开源。</p>

如果大家对 Mako 是如何从 0 到 1 到开源搭建出来的，我在今年的 GIAC 上的分享 [《Rust 构建工具在蚂蚁的研发和落地》](https://giac.msup.com.cn/2024sz/course?id=17467) 会详细介绍，同时会议结束后也会以文字形式分享到社区。

## 如何参与内测

如果你是 Umi 用户，并且对现有项目的构建速度不满意，体验 Mako 非常简单！先确认 Umi 版本有升级到 4.2.0 或以上，然后执行 `npx umi config set mako {}` 命令在配置里加上 `mako: {}`，然后执行 `umi build` 或 `umi dev` 即可使用 Mako 进行构建。

```bash
$ npx umi -v
4.2.0
$ npx umi config set mako {}
$ npx umi build
```

如果不是 Umi 用户，也可以在 [Getting Started](/getting-started) 页快速上手尝试不同类型的项目，目前没有针对这块做打磨，可能体验不佳，欢迎反馈。

如果你有任何问题或建议，可以在扫码加我们的微信群。

<img src="https://res.cloudinary.com/sorrycc/image/upload/v1715585116/blog/q4f5p3o6.jpg" width="120" />

或者点击以下链接加入 Telegram 群。

https://t.me/+EN3fycCw3TI1NDA1

## 致谢

TODO

## 下一步

我们会接着做 DX、性能、产物尺寸等方面的优化，同时会在内测期间收集用户反馈，最终计划在 6 月底开源。感谢大家的支持！
