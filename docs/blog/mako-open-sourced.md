---
title: Mako - Mako is Now Open Source
publishedAt: 2024-06-28T00:00:00.000Z
authors:
  - name: sorrycc
    link: https://github.com/sorrycc
translated_at: '2024-06-26T13:33:53.477Z'
---

# Mako is Now Open Source

_2024-06-28 by [sorrycc](https://github.com/sorrycc)_

中文版: [《Mako 开源了》](./mako-open-sourced_zh-CN)。

<img src="https://img.alicdn.com/imgextra/i4/O1CN01dvFN0j1e2rYBJpJGJ_!!6000000003814-2-tps-2048-2048.png_240x240.jpg" width="120" height="120" />

Hi, I am sorrycc, one of the main maintainers of Mako, and also the creator of Umi, Dva, Father, and other libraries. I am thrilled to announce that Mako is finally open source, and I’m excited to formally introduce it to you today.

## What is Mako?

Mako is an "extremely fast" and "production-grade" front-end build tool, based on Rust.

The "extremely fast" aspect was our initial motivation for starting the Mako project. Without build speed issues, Mako would not have been necessary. Refer to the Benchmark section below for some data, and we are constantly exploring even faster build speed solutions. The "production-grade" label comes from the fact that since 2023.11.24, Mako has been officially released internally at Ant Group. It has been validated with engineering practices on thousands of projects and all used npm packages and their versions. It has been implemented in hundreds of projects, serving various platforms and business scenarios internally, including management backends, mini-programs, H5 mobile, low-code, marketing, component libraries, component packaging, Serverless Functions, etc., demonstrating fully production-grade capabilities.

You can visit https://makojs.dev/docs/features to learn more about Mako's features.

## How did Mako come about?

Last year (2023.3), our team launched 3 projects, Rust, SSR, and AIG, and we took on the Rust direction to tackle build performance issues. Our team has been exploring faster build speed solutions, including [MFSU](https://umijs.org/blog/mfsu-faster-than-vite), which optimizes build speed within Webpack. However, this had certain limitations. We sought a thorough solution through Rust.

![](https://img.alicdn.com/imgextra/i2/O1CN01GDA0FY1mgixV0oGkA_!!6000000004984-2-tps-2772-1330.png_1200x1200.jpg)

You might wonder why we didn’t use existing Rust tools but decided to create one ourselves. The reasons are complex. For instance, 1) the maturity level of community libraries and their compatibility with Ant’s needs, we researched all the community Rust build solutions before starting, ultimately deciding on creating our own, 2) having control, due to business reasons, build tools at Ant require a lot of customization, and this proved true as we found many matching needs after internal release, 3) the modern meta-frameworks require compilation-time frameworks, in addition to build, they also have a lot of compilation needs, especially in SSR & RSC scenarios, for example, RSC scenarios required 4 builds internally, 4) the need to learn Rust and for team growth, modern frontend tools are all written in Rust, and we would fall behind if we did not advance.

![](https://img.alicdn.com/imgextra/i3/O1CN012T9Nlo1WVFBDT64dK_!!6000000002793-2-tps-2090-854.png)

The timeline above is for Mako. Mako kicked off in 2023.3, had its first usable version by 2023.7, was internally released at Ant in 2023.11, and was open-sourced by 2024.6. We initially had 3 members with zero Rust experience, with team members, especially the virtual team, coming and going, learning Rust while digesting build knowledge and working on Mako was challenging, but fortunately, we succeeded and learned a lot in the process. We would like to thank the pioneers in the build domain like Webpack, Farm, and Rspack, as well as ChatGPT.

## Speed

Mako has put a lot of effort into speed. Below is some Benchmark data.

![](https://img.alicdn.com/imgextra/i1/O1CN01Ibymuk1xrDoNp2jBg_!!6000000006496-2-tps-2018-340.png)

The Benchmark ran on a project that Turbopack also tests, on a Mac Book Pro M2 Max. It includes dimensions such as dev cold start time, root node and leaf node HMR time, production Build build time, and JS bundle size. (Note: Farm was not tried successfully using API mode, so no HMR data was generated; RsBuild had some issues upgrading to 0.7, so it’s still on 0.6 for now. RsBuild 0.7 might be a bit faster.)

If you’re interested, feel free to clone the repository and try it out yourself.

```bash
$ git clone git@github.com:umijs/benchmark.git
$ cd benchmark
$ pnpm i
$ pnpm run setup
$ pnpm benchmark
```

Here's how we compare to our previous selves.

![](https://img.alicdn.com/imgextra/i4/O1CN01UkKwZd1nsv7biyZKf_!!6000000005146-1-tps-825-365.gif)

For Ant Design Pro full project build, Webpack takes 16s, Mako takes 3.9s, a 4x speed improvement.

![](https://img.alicdn.com/imgextra/i3/O1CN0180np4N1oZyLr5911c_!!6000000005240-1-tps-1340-610.gif)

For Ant Design Pro full project build, Mako is almost always real-time hot updates.

![](https://img.alicdn.com/imgextra/i2/O1CN01LpdES21tqWkFN9mCg_!!6000000005953-1-tps-960-540.gif)

Intranet Hybrid framework Smallfish project build, based on RSC (React Server Components), scaffold project, build time reduced from 36.7s to 1.2s. It looks a bit exaggerated, but these are real data.

![](https://img.alicdn.com/imgextra/i3/O1CN01L1HteO1uPKqayzb0u_!!6000000006029-2-tps-1538-494.png)

These are more examples of speed improvements on such RSC projects.

![](https://img.alicdn.com/imgextra/i2/O1CN01bzKzwO1gnEtk9Z8pN_!!6000000004186-2-tps-2198-852.png)

Additionally, Mako also has an experimental SSU feature, similar to the previous MFSU implementation, which does packaging and caching of dependencies. Depending on the ratio of source code to dependencies, it can achieve a 10-50x speed boost in Dev hot start-up. Currently, it can be enabled with the `SSU=true` environment variable.

## How to participate?

If you want to experience Mako, you can create a Mako + React project with a single command using the scaffolding tool.

```bash
$ npm create mako
```

If you're a Umi user, it's very simple to experience Mako!

```bash
# Make sure your version is 4.2.0 or above
$ npx umi -v
4.2.0
# Enable mako configuration
$ npx umi config set mako {}
# Run build or other commands
$ npx umi build
```

If you want to discuss issues or suggestions about Mako, you can scan the QR code to join our WeChat group. (If it's expired or the group is full, please go to https://makojs.dev/docs/feedback for a new QR code.)

<img src="https://img.alicdn.com/imgextra/i1/O1CN01kKspME1FdAZ4cQ1F5_!!6000000000509-0-tps-1050-1671.jpg_240x240.jpg" width="120" />

Or click the following link to join our Telegram group.

https://t.me/+EN3fycCw3TI1NDA1

Also, you're welcome to subscribe to Mako updates via RSS. We'll post the latest news about Mako and high-quality technical articles related to building.

https://makojs.dev/rss.xml

If you want to get involved in Mako's open source, you can visit https://github.com/umijs/mako and [CONTRIBUTING document](https://makojs.dev/docs/contributing) to learn more. Anyone who has submitted Bugfix or Feature PRs can choose to join Mako's developer DingTalk group.

If you plan to deeply promote and apply Mako in your company, or develop based on Mako, you can contact us (mailto:sorrycc@gmail.com) for discussion. We can provide the relevant training, consulting, and more timely support services.

<img src="https://img.alicdn.com/imgextra/i4/O1CN01uWRI3O1Dy7RzGO3fy_!!6000000000284-1-tps-320-224.gif" width="160" />

## Live Q&A

Tonight (June 28, 2024) at 9 PM, we'll be hosting a live Q&A on Bilibili, reservation link available at https://t.bilibili.com/947260122376175622. We welcome everyone to participate, and you can ask anything about Mako. If you have questions about Mako, you can fill in the questionnaire in advance at https://docs.qq.com/form/page/DY2Z6VndTRXBpR1Nh.

## Acknowledgements

The release of Mako would not have been possible without each contributor, especially since most of them have participated in their spare time. Thank you!

- Those who have submitted code to Mako: [hedeng](https://github.com/hedeng9), [jiesia](https://github.com/jiesia), [Maple0817](https://github.com/Maple0817), [vagusX](https://github.com/vagusX), [chessl](https://github.com/chessl), [HiLanXiao](https://github.com/HiLanXiao), [JackGuiYang12](https://github.com/JackGuiYang12), [zhangpanweb](https://github.com/zhangpanweb), [ctts](https://github.com/ctts), [goo-yyh](https://github.com/goo-yyh), [whyer11](https://github.com/whyer11)
- Those who are still actively participating in the development of Mako: [PeachScript](https://github.com/PeachScript), [stormslowly](https://github.com/stormslowly), [xusd320](https://github.com/xusd320), [LovePlayCode](https://github.com/LovePlayCode), [Jinbao1001](https://github.com/Jinbao1001), [sorrycc](https://github.com/sorrycc)
- Community members who used Mako in the early stages and provided suggestions: [xiaohuoni](https://github.com/xiaohuoni), [xierenyuan](https://github.com/xierenyuan)
- The initiator of the project: [afc163](https://github.com/afc163)
- Logo designer: [golevkadesign](https://github.com/golevkadesign)
- The stylish landing page's PD, designers, and developers: [bupthly](https://github.com/bupthly), 亿元, [Wu-kung](https://github.com/Wu-kung)

And many authors of the community's dependencies libraries!

- [webpack](https://github.com/webpack/webpack), which inspired lots of ideas of Mako.
- [swc](https://github.com/swc-project/swc) by [@kdy1](https://github.com/kdy1), which powered the parsing, transforming and code generation of Mako.
- [farm](https://github.com/farm-fe/farm) by [@brightwu](https://github.com/wre232114), which inspired the tree shaking, plugin system and others of Mako.
- [rspack](https://github.com/web-infra-dev/rspack), which inspired the tree shaking of Mako.
- [oxc-resolver](https://github.com/oxc-project/oxc-resolver) by [@Boshen](https://github.com/Boshen) which powered the resolver of Mako.
