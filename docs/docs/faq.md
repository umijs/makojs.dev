---
title: Mako - FAQ
---

# FAQ

Below are some frequently asked questions about Mako. You can also ask questions on the [Github or Group](/docs/faq#how-to-ask-questions%3F).

## Should I Use Mako?

Please note that Mako is still experimental and not yet open-sourced. While it's used in hundreds of projects at Ant Financial, but if you want to use it in your project on production, you should be aware of the risks.

## Does Mako Support Windows?

Not yet. Mako is currently only supported on MacOS and Linux. Windows support is planned after the open-source release.

## Open Source

Mako is planned to be open-sourced by the end of June 2024.

## Webpack Compatibility

Mako is not designed to be compatible with Webpack's community loaders and plugins. It's designed to be a more opinionated and integrated solution. If you have a Webpack plugin that you want to use with Mako, you can try to port it to Mako.

Known incompatibilities:

- [monaco-editor](https://github.com/microsoft/monaco-editor) with monaco-editor-webpack-plugin, which is not compatible with Mako. Try to use [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) instead, which is easy and faster in production.

## html-webpack-plugin compatibility

Mako don't support html-webpack-plugin, and does't handle html files. If you want to emit html files, you should do it manually. Add [`stats`](/docs/config#stats) config to `mako.config.js`, then you can get information about the build, and you can write your own html files.

```js
{
  stats: {
  },
}
```
