---
title: Mako - Contributing
---

# Contributing

## Getting Started

Clone.

```bash
$ git clone git@github.com:umijs/mako.git
$ cd mako
```

Install tools.

```bash
$ cargo install just
$ cargo install cargo-binstall
```

Compile.

```bash
$ cargo build
$ cargo build --release
```

Build js packages (include packages/mako).

```bash
$ pnpm build
```

Run.

```bash
$ cargo run --bin mako examples/normal
# with HMR
$ cargo run --bin mako examples/normal --watch
# in production
$ cargo run --bin mako examples/normal --mode production
```

## Before you push

```bash
$ just ready
```

## Test

```bash
$ pnpm playwright install # only need to run before the first time
$ just test
# test specified testcase
$ cargo nextest run transformers::transform_try_resolve::tests
```

## Coverage

```bash
$ cargo codecov
$ cargo codecov --html && open target/llvm-cov/html/index.html
```

## Format

```bash
$ just fmt
```

## Lint

```bash
$ just lint
```

## Upgrade Dependencies

```bash
$ cargo upgrade
$ cargo upgrade --incompatible
$ cargo upgrade --dry-run
```
