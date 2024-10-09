---
title: Mako - Mako 内测了
publishedAt: 2024-05-15 00:00:00
authors:
  - name: sorrycc
    link: https://github.com/sorrycc
---

# Mako 内测了

_2024-05-15 by [sorrycc](https://github.com/sorrycc)_

<img src="https://img.alicdn.com/imgextra/i4/O1CN01dvFN0j1e2rYBJpJGJ_!!6000000003814-2-tps-2048-2048.png" width="120" height="120" />

朋友们，大家好！Mako 终于内测了。

Mako 是极快和生产级的前端构建工具，基于 Rust。Mako 去年上半年立项，下半年 2023.11.24 在蚂蚁集团内部正式发布，通过工程化的方式验证了数千个项目和 npm 包，已落地数百个项目，服务了中后台、小程序、低代码、营销等多个不同平台和业务场景。经过大量项目的实践和长时间的迭代，Mako 已经成熟，在速度和产物尺寸方面都已和社区的 Rust 构建方案齐平或实现超越，现在我们决定**在开源之前先做一轮内测来收集更多的反馈**。

![](https://img.alicdn.com/imgextra/i2/O1CN01RmMfYO1w1BCcB2fqX_!!6000000006247-2-tps-2024-230.png)

<p style="text-align:center;">Benchmark 基于 <a href="https://github.com/farm-fe/performance-compare">performance-compare</a> 里的项目，相关仓库会随 Mako 一起开源。</p>

如果大家对 Mako 是如何从 0 到 1 到开源搭建出来的，我在今年 GIAC 上的分享 [《Rust 构建工具在蚂蚁的研发和落地》](https://giac.msup.com.cn/2024sz/course?id=17467) 会详细介绍，同时会议结束后也会以文字形式分享到社区。

## 如何参与内测

如果你是 Umi 用户，并且对现有项目的构建速度不满意，体验 Mako 非常简单！先确认 Umi 版本有升级到 4.2.0 或以上，然后执行 `npx umi config set mako {}` 命令在配置里加上 `mako: {}`，然后执行 `umi build` 或 `umi dev` 即可使用 Mako 进行构建。

```bash
$ npx umi -v
4.2.0
$ npx umi config set mako {}
$ npx umi build
```

如果不是 Umi 用户，也可以一键创建 Mako + React 的项目。

```bash
$ npm create mako
```

如果你有任何问题或建议，可以在扫码加我们的微信群。

<img src="https://mdn.alipayobjects.com/huamei_lpyngx/afts/img/A*4xXlQITJ2agAAAAAAAAAAAAADjjvAQ/original" width="120" />

或者点击以下链接加入 Telegram 群。

https://t.me/+EN3fycCw3TI1NDA1

同时，也欢迎大家通过 RSS 的方式订阅 Mako 的动态，我们会在这里发布 Mako 的最新消息以及和构建相关的高质量技术文章。

https://makojs.dev/rss.xml

## 致谢

Mako 的发布离不开感谢每一位贡献者。大部分同学还是虚线业余时间参与的，感谢你们的付出！

- 曾经给 Mako 提交过代码的同学，[禾登](https://github.com/hedeng9)、[杰司](https://github.com/jiesia)、[灏辰](https://github.com/Maple0817)、[伊北](https://github.com/vagusX)、[棋怪](https://github.com/chessl)、[常夜](https://github.com/HiLanXiao)、[桂阳](https://github.com/JackGuiYang12)、[卫初](https://github.com/zhangpanweb)、[桃树](https://github.com/ctts)
- 当下仍在参与 Mako 开发的同学，[辟起](https://github.com/PeachScript)、[辟殊](https://github.com/stormslowly)、[无玄](https://github.com/xusd320)、[油油](https://github.com/goo-yyh)、[谦男](https://github.com/LovePlayCode)、[枭晓](https://github.com/Jinbao1001)、[云谦](https://github.com/sorrycc)
- 社区前期使用 Mako 并提供建议的同学，[小虎](https://github.com/xiaohuoni)、[小平淡](https://github.com/xierenyuan)
- 项目发起人，[偏右](https://github.com/afc163)
- Logo 设计师，短篇

## 下一步

我们会接着做 DX、性能、产物尺寸等方面的优化，同时会在内测期间收集用户反馈，最终计划在 6 月底开源。感谢大家的支持！
