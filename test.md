# 如何在 Mako 官网中测试 petercat？

1. 本地构建 Mako 官网的 HTML 产物并本地托管

```bash
$ git clone git@github.com:umijs/makojs.dev.git --branch feature/petercat-bubble
$ pnpm i && pnpm build && cd dist
$ pnpm dlx serve
```

2. 本地预览及调试

访问第 1 步打印的托管地址，默认是 `http://localhost:3000`，即可预览效果；PetercatLUI 的调用在 `dist/index.html` 中最尾部的 `scripts` 标签中，可以修改调试 

