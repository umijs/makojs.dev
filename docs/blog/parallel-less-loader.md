---
title: Mako - nodejs 多线程的魔力 - mako 中的 less 并行编译器
publishedAt: 2024-06-18T20:00:00.000Z
authors:
  - name: xusd320
    link: 'https://github.com/xusd320'
---
# nodejs 多线程的魔力 - mako 中的 less 并行编译器

_2024-06-18_

<img src="https://img.alicdn.com/imgextra/i2/O1CN01kdmA7X1FVqCPcRi3L_!!6000000000493-2-tps-584-584.png" width="120" height="120" />

less 文件编译是每个前端通用打包工具必备的能力。在 Mako 中，对于 less 文件的编译并没有基于 rust 实现，而是通过 napi 将 less 文件交给 nodejs 的 [less loader](https://lesscss.org/) ，编译好后，再返回给 rust。
Mako 的 rust 部分会根据机器配置启动线程池，将所有 cpu 都利用上，而在遇到 less 文件时，这些线程都会阻塞式等待 less loader 返回，使得在打包大量使用 less 的项目时，可能存在一定性能瓶颈。
我们在使用 mako 构建一个蚂蚁内部的大型项目时，整个构建耗时约为 **21s**，而 less 文件的处理约占了 **5s**。我们开始研究怎么给 less 编译提速。

我们考虑过两种方案：

1. 用 rust 重新实现 less 编译。这就需要从 0 开始构建一个 less 编译器，成本巨大；
2. 基于 nodejs 的 worker_threads 并行编译 less。对于早期接触 nodejs 的开发者来说，可能对它的印象是：单线程，不适合做并行计算。但如今的 nodejs 已经进化了，在 10 版本就开始试验性地支持 worker 线程，12 版本提供了稳定 api。

出于成本原因，我们优先尝试方案 2。在此方案下，我们需要考虑：

- 充分利用 cpu 多核；
- nodejs 主线程不能阻塞住，因为 rust 通过 napi 调用 nodejs 必须经过 nodejs 主线程，如果主线程被阻塞，性能会更差;
- 需要封装成异步 RPC 方法以保证易用性，减少对现有代码的破坏。

社区对于 nodejs 线程池的封装，比较成熟的有 [workerpool](https://www.npmjs.com/package/workerpool) 、[piscina](https://www.npmjs.com/package/piscina) 。

二者的比较如下：

- 都具备 RPC 封装，隐藏了和 worker 通信的细节（nodejs 中主线程、 worker 线程间通信是基于 [MessageChannel](https://nodejs.org/dist/v20.14.0/docs/api/worker_threads.html#class-messagechannel) , 和浏览器上环境中的 [MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel) 十分接近，其底层是一个非阻塞的通信队列）；
- 默认都实现了 FIFO 任务调度，piscina 还支持自定义调度策略;
- workerpool 启动时创建 worker 线程是常驻的，用完后需要手动销毁线程池，而 piscina 支持根据任务负载动态创建和销毁 worker 线程;
- workerpool 支持 child_process、worker_threads、WebWorker 多种模式，可兼容低版本 nodejs 和浏览器环境，piscina 只基于 worker_threads，专为 nodejs 设计;
- 二者在性能上没有明显差异。

早期我们基于 workerpool 写了一版，构建优能有明显提升，之前的大项目， less 编译耗时从 **5s** 降低到了 **1s**。workerpool 默认创建的 worker 线程数量是 require('os').cpus().length - 1, 预留一个 cpu 核心给 nodejs 主线程，防止主线程因无 cpu 可用而被挂起。在实际测试中，基于 workerpool 的实现，在 linux 机器下，如果 nodejs 版本低于 20.3.0， 可能会意外退出（signal: "SIGABRT），原因暂时无法定位。不过基于 piscina 的实现没有这个问题。下面上代码：

```ts
// render.ts
import fs from "fs";
import less from "less";

module.exports = async function render(param: {
  filename: string;
  opts: LessLoaderOpts;
}): Promise<{ content: string; type: "css" }> {
  const { modifyVars, math, sourceMap, plugins } = param.opts;

  const input = fs.readFileSync(param.filename, "utf-8");

  const pluginInstances: Less.Plugin[] | undefined = plugins?.map((p) => {
    if (Array.isArray(p)) {
      const pluginModule = require(p[0]);
      const PluginClass = pluginModule.default || pluginModule;
      return new PluginClass(p[1]);
    } else {
      return require(p);
    }
  });

  const result = await less
    .render(input, {
      filename: param.filename,
      javascriptEnabled: true,
      math,
      plugins: pluginInstances,
      modifyVars,
      sourceMap,
      rewriteUrls: "all",
    } as unknown as Less.Options)
    .catch((err) => {
      throw new Error(err.toString());
    });

  return { content: result.css, type: "css" };
};
```

```ts
// index.ts
const createParallelLoader = () =>
  new Piscina<
    { filename: string; opts: LessLoaderOpts },
    { content: string; type: "css" }
  >({
    filename: path.resolve(__dirname + "/render.js"),
    idleTimeout: 30000,
    recordTiming: false,
    useAtomics: false,
  });

function lessLoader(opts: LessLoaderOpts) {
  const parallelLessLoader = createParallelLoader();
  return {
    render: async (filePath: string) => {
      return await parallelLessLoader.run({ filename, opts });
    },
    terminate: () => {
      parallelLessLoader.destroy();
    },
  };
}

export { lessLoader };
```

render.ts 是 RPC 方法的实现部分，为 less 编译器本体，index.ts 将其注册为 RPC 方法，上层直接发起异步调用即可。在 index.ts render 方法内部，每次调用 parallelLessLoader.run，piscina 实例会将入参存入内部调度队列的尾部，并尝试从线程池中获取空闲的 worker 线程，如果所有 worker 线程都在工作中，且线程总数还未达到最大线程数，则创建一个新的 worker 线程，当获取到可用 worker 线程后，取队列头部的任务参数，通过 MessageChannel 发送给 worker 线程并执行 render 方法，结束后再通过 MessageChannel 返回结果，否则任务会压入队列并重复以上过程。 上述代码中，除了实现基础的 less 编译之外，我们还支持了 lessjs 插件机制，插件跟随 lessjs 运行在独立的 worker 线程中。

实测下来，基于 piscina 的实现 less 编译器，性能提升效果和 workerpool 版持平，集成到 mako 中后，比单线程版本快 **4 ～ 5** 倍。

