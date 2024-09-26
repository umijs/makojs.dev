---
title: Mako - Mako 开源了
publishedAt: 2024-06-28 00:00:00
authors:
  - name: sorrycc
    link: https://github.com/sorrycc
---

# Mako 开源了

_2024-06-28 by [sorrycc](https://github.com/sorrycc)_

English Version: [Mako is Now Open Source](./mako-open-sourced).

![](https://img.alicdn.com/imgextra/i4/O1CN01CK3ElF1kFaFzFBUiA_!!6000000004654-0-tps-1200-662.jpg)

Hi，我是 sorrycc，Mako 的主要负责人之一，也是 Umi、Dva、Father 等库的作者。很开心，Mako 终于开源了，Github 地址是 https://github.com/umijs/mako/ ，今天和大家正式介绍下他。

## Mako 是什么？

<img src="https://img.alicdn.com/imgextra/i4/O1CN01dvFN0j1e2rYBJpJGJ_!!6000000003814-2-tps-2048-2048.png_240x240.jpg" width="120" height="120" />

Mako 是「极快」和「生产级」的前端构建工具，基于 Rust。

「极快」是我们立项做 Mako 的初衷，没有构建速度问题也就没有 Mako，参考下方的 Benchmark 区域部分数据，同时我们也一直在探索更快的构建速度方案；而「生产级」是因为 Mako 自 2023.11.24 起已在蚂蚁内部正式发布，通过工程化的方式验证了数千个项目和所有用到的 npm 包及其不同版本，已落地数百个项目，并对内服务了中后台、小程序、H5 移动端、低代码、营销、组件库、组件打包、Serverless Function 等多个不同平台和业务场景，已具备了生产级的能力。

大家可以访问 https://makojs.dev/docs/features 了解 Mako 的更多特性。

## Mako 怎么来的？

去年（2023.3）我们团队立了 3 个项，Rust、SSR 和 AIGC，我们领了 Rust 方向，解构建性能的问题。我们团队一直在探索更快的构建速度方案，包括之前发布的 [MFSU](https://umijs.org/blog/mfsu-faster-than-vite)，都是在 Webpack 里对构建速度进行优化，这有一定的局限性。我们希望通过 Rust 来寻求这个问题的彻底解。

![](https://img.alicdn.com/imgextra/i2/O1CN01GDA0FY1mgixV0oGkA_!!6000000004984-2-tps-2772-1330.png_1200x1200.jpg)

大家可能会好奇，为啥我们不用现有 Rust 工具而是自己做一个？原因是复杂的，比如以下几点。1）当时社区库的成熟度和和蚂蚁的需求匹配度，我们在动手前调研了所有社区的 Rust 构建方案，但最终选择自研，2）主动权，业务原因，构建工具在蚂蚁会有大量定制需求，事实也是如此，我们在内部发布后，发现拿着构建这个锤子找到了很多与之匹配的钉子，3）现代的元框架是编译时框架，除了构建之外，还有大量编译需求，尤其是 SSR & RSC 的场景，比如在我们内部，RSC 场景需要 4 次构建，4）学 Rust 的需求和团队成长需求等，现代前端工具都是 Rust 编写，我们不进则退。

![](https://img.alicdn.com/imgextra/i3/O1CN012T9Nlo1WVFBDT64dK_!!6000000002793-2-tps-2090-854.png)

上图是 Mako 的时间线。Mako 于 2023.3 Kickoff，2023.7 有了第一个可用版本，2023.11 在蚂蚁内部发布，2024.6 开源。我们初始由 3 个 0 Rust 基础的同学组织，团队成员尤其是虚拟团队同学来来走走，边学 Rust 边啃构建领域知识边做 Mako 还是很刺激的，所幸我们还是做出来了，在这个过程中也学到了很多。在此感谢构建领域的前辈 Webpack、Farm 和 Rspack 等，以及 ChatGPT。

## 速度

Mako 在速度上花了不少功夫，下方是 Benchmark 数据。

![](https://img.alicdn.com/imgextra/i1/O1CN01Ibymuk1xrDoNp2jBg_!!6000000006496-2-tps-2018-340.png)

Benchmark 跑的项目是大家都在跑的 Turbopack 的测试项目，跑在 Mac Book Pro M2 Max 电脑上。包含维度有 dev 冷启动时间、根节点和叶子节点的 HMR 时间、生产 Build 构建时间和 JS 产物尺寸。（注：Farm 使用 API 的方式没有尝试成功，所以没有生成 HMR 数据；RsBuild 升级 0.7 遇到点问题，所以目前还是 0.6，RsBuild 的 0.7 应该会更快一些。）

如果大家感兴趣，不妨自己手动 clone 仓库跑跑看。

```bash
$ git clone git@github.com:umijs/benchmark.git
$ cd benchmark
$ pnpm i
$ pnpm run setup
$ pnpm benchmark
```

以下是我们和之前自己的对比。

![](https://img.alicdn.com/imgextra/i4/O1CN01UkKwZd1nsv7biyZKf_!!6000000005146-1-tps-825-365.gif)

Ant Design Pro 全量项目的构建，Webpack 用时 16s，Mako 用时 3.9s，提速 4 倍。

![](https://img.alicdn.com/imgextra/i3/O1CN0180np4N1oZyLr5911c_!!6000000005240-1-tps-1340-610.gif)

Ant Design Pro 全量项目的构建，Mako 基本都是实时热更。

![](https://img.alicdn.com/imgextra/i2/O1CN01LpdES21tqWkFN9mCg_!!6000000005953-1-tps-960-540.gif)

内网 Hybrid 框架 Smallfish 的项目构建，基于 RSC（React Server Components），脚手架项目，构建时间从 36.7s 减少到 1.2s。看起来有点夸张，但这是真实的数据。

![](https://img.alicdn.com/imgextra/i3/O1CN01L1HteO1uPKqayzb0u_!!6000000006029-2-tps-1538-494.png)

以上是更多这类 RSC 项目的提速效果。

![](https://img.alicdn.com/imgextra/i2/O1CN01bzKzwO1gnEtk9Z8pN_!!6000000004186-2-tps-2198-852.png)

此外，Mako 还有个试验性的 SSU 功能，类似之前的 MFSU 实现，会做依赖的打包和缓存。根据源码和依赖比的不同，可实现 Dev 热启动的 10-50 倍提速。目前暂时通过 `SSU=true` 环境变量开启。

## 如何参与？

如果你想体验 Mako，可通过脚手架一键创建 Mako + React 的项目。

```bash
$ npm create mako
```

如果你是 Umi 用户，体验 Mako 非常简单！

```bash
# 确认版本是 4.2.0 或以上
$ npx umi -v
4.2.0
# 开启 Mako 配置
$ npx umi config set mako {}
# 执行构建或其他命令
$ npx umi build
```

如果你想交流关于 Mako 的问题或建议，可以扫码加我们的微信群。（过期或群满了请到 https://makojs.dev/docs/feedback 查看新的二维码）

<img src="https://mdn.alipayobjects.com/huamei_lpyngx/afts/img/A*NbqoQJB25dAAAAAAAAAAAAAADjjvAQ/original" width="120" />

或者点击以下链接加入 Telegram 群。

https://t.me/+EN3fycCw3TI1NDA1

同时，也欢迎大家通过 RSS 的方式订阅 Mako 的动态，我们会在这里发布 Mako 的最新消息以及和构建相关的高质量技术文章。

https://makojs.dev/rss.xml

如果你希望参与到 Mako 的开源，可访问 https://github.com/umijs/mako 和 [CONTRIBUTING 文档](https://makojs.dev/docs/contributing)了解更多。所有提交过 Bugfix 或 Feature PR 的同学，都可以选择加入到 Mako 的开发者钉钉群里。

如果你计划在你的公司深度推广和应用 Mako，或者基于 Mako 做二次开发，可以联系我们（[sorrycc#gmail.com](mailto:sorrycc@gmail.com)）沟通，我们可以提供相应的培训、咨询和更及时的支持服务。

<img src="https://img.alicdn.com/imgextra/i4/O1CN01uWRI3O1Dy7RzGO3fy_!!6000000000284-1-tps-320-224.gif" width="160" />

## 直播答疑

今天（2024.6.28）晚 9 点，我们会在 B 站开个直播答疑，预约地址见 https://t.bilibili.com/947260122376175622 ，欢迎大家来参与，可以问关于 Mako 的任何问题。大家有关于 Mako 的问题可以预先填下问卷 https://docs.qq.com/form/page/DY2Z6VndTRXBpR1Nh 。

## 致谢

Mako 的发布离不开每一位贡献者，尤其大部分同学还是虚线业余时间参与的，感谢！

- 曾给 Mako 提交过代码的[禾登](https://github.com/hedeng9)、[杰司](https://github.com/jiesia)、[灏辰](https://github.com/Maple0817)、[伊北](https://github.com/vagusX)、[棋怪](https://github.com/chessl)、[常夜](https://github.com/HiLanXiao)、[桂阳](https://github.com/JackGuiYang12)、[卫初](https://github.com/zhangpanweb)、[桃树](https://github.com/ctts)、[油油](https://github.com/goo-yyh)、[辰酉](https://github.com/whyer11)
- 当下仍积极参与 Mako 开发的[辟起](https://github.com/PeachScript)、[辟殊](https://github.com/stormslowly)、[无玄](https://github.com/xusd320)、[谦男](https://github.com/LovePlayCode)、[枭晓](https://github.com/Jinbao1001)、[云谦](https://github.com/sorrycc)
- 社区前期使用 Mako 并提供建议的[小虎](https://github.com/xiaohuoni)、[小平淡](https://github.com/xierenyuan)
- 项目发起人[偏右](https://github.com/afc163)
- Logo 设计师[短篇](https://github.com/golevkadesign)
- 非常有格调的 Landing 页的 PD、设计师和开发，[山间](https://github.com/bupthly)、亿元、[杜杰](https://github.com/Wu-kung)

以及很多社区的依赖库作者！

- [webpack](https://github.com/webpack/webpack), which inspired lots of ideas of Mako.
- [swc](https://github.com/swc-project/swc) by [@kdy1](https://github.com/kdy1), which powered the parsing, transforming and codegen of Mako.
- [farm](https://github.com/farm-fe/farm) by [@brightwu](https://github.com/wre232114), which inspired the tree shaking, plugin system and others of Mako.
- [rspack](https://github.com/web-infra-dev/rspack), which inspired the tree shaking of Mako.
- [oxc-resolver](https://github.com/oxc-project/oxc-resolver) by [@Boshen](https://github.com/Boshen) which powered the resolver of Mako.
- [Oxc](https://github.com/oxc-project/oxc/) by [@Boshen](https://github.com/Boshen) from which We learned a lot about how to develop efficiently in Rust.
- [biome](https://github.com/biomejs/biome) by [@ematipico](https://github.com/ematipico) from which We learned a lot about how to develop efficiently in Rust.
