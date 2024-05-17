---
title: Mako - FAQ
---

# FAQ

Below are some frequently asked questions about Mako. You can also ask questions on the [Github or Group](/faq#how-to-ask-questions%3F).

## Should I use Mako?

Please note that Mako is still experimental and not yet open-sourced. While it's used in hundreds of projects at Ant Financial, if you want to use it in your project on production, you should be aware of the risks.

## Does mako support Windows?

Not yet. Mako is currently only supported on MacOS and Linux. Windows support is planned after open-source release.

## Open source

Mako is planned to be open-sourced by the end of June 2024.

## Webpack compatibility

Mako is not designed to be compatible with Webpack's community loaders and plugins. It's designed to be a more opinionated and integrated solution. If you have a Webpack plugin that you want to use with Mako, you can try to port it to Mako.

Known incompatibilities:

- [monaco-editor](https://github.com/microsoft/monaco-editor) with monaco-editor-webpack-plugin, which is not compatible with Mako. Try to use [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) instead, which is easy and faster in production.

## How to ask questions?

You can ask questions on the [Github issue tracker](https://github.com/umijs/umi).

Or, join the wechat group by scanning the QR code below:

<img src="https://res.cloudinary.com/sorrycc/image/upload/v1715585116/blog/q4f5p3o6.jpg" width="120" />

Or, join the Telegram group by clicking the link below:

https://t.me/+EN3fycCw3TI1NDA1
