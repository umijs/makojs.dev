---
title: Mako - Contributing
translated_at: '2024-06-26T13:23:41.096Z'
---

# 贡献指南

## 入门指南

克隆项目。

```bash
$ git clone git@github.com:umijs/mako.git
$ cd mako
```

安装工具。

```bash
$ cargo install just
$ cargo install cargo-binstall
```

编译。

```bash
$ cargo build
$ cargo build --release
```

构建 js 包（包括 packages/mako 目录下的）。

```bash
$ pnpm build
```

运行。

```bash
$ cargo run --bin mako examples/normal
# 使用 HMR
$ cargo run --bin mako examples/normal --watch
# 生产环境
$ cargo run --bin mako examples/normal --mode production
```

## 推送前检查

```bash
$ just ready
```

## 测试

```bash
$ pnpm playwright install # 只需在第一次运行前执行
$ just test
# 测试指定的测试用例
$ cargo nextest run transformers::transform_try_resolve::tests
```

## 覆盖率

```bash
$ cargo codecov
$ cargo codecov --html && open target/llvm-cov/html/index.html
```

## 格式化

```bash
$ just fmt
```

## 检查

```bash
$ just lint
```

## 升级依赖

```bash
$ cargo upgrade
$ cargo upgrade --incompatible
$ cargo upgrade --dry-run
```
