import ejs from 'ejs';
import 'zx/globals';
import { Markdown } from './Markdown';
import { Collection } from './Collection';

async function main() {
  await build();
}

function generateLLM() {
  let cwd = process.cwd();
  // 读取 templates/default.ejs 文件
  const ejsFilePath = path.join(cwd, "templates/default.ejs");
  const ejsContent = fs.readFileSync(ejsFilePath, "utf-8");

  // 匹配 <a href="...">...</a>
  const linkRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;
  let match;
  const links = [];

  while ((match = linkRegex.exec(ejsContent)) !== null) {
    const url = match[1];
    const text = match[2];
    links.push({ url, text });
  }

  const llmsFilePath = path.join(cwd, "dist/llms.txt");
  const base_url = "https://makojs.dev";

  const docsIndexContent = [
    "# Mako",
    "",
    "## Docs",
    "",
    ...links.map((link) => `- [${link.text}](${base_url}${link.url})`),
    "",
    "## Optional",
    "",
  ].join("\n");

  fs.writeFileSync(llmsFilePath, docsIndexContent);
  console.log("Generated llms.txt");
}

export async function build() {
  console.log('Building...');
  let cwd = process.cwd();
  let docsDir = path.join(cwd, 'docs');

  let docs = await (async () => {
    let docs = await glob('**/*.md', { cwd: docsDir });
    return docs.map((doc) => {
      let html = doc.replace(/\.md$/, '.html');
      if (doc === 'README.md') {
        html = 'index.html';
      } else if (doc.endsWith('/README.md')) {
        html = doc.replace(/\/README\.md$/, '/index.html');
      }
      return { html, markdown: doc };
    });
  })();

  // compile markdown to html
  for (let { html, markdown } of docs) {
    let mdPath = path.join(docsDir, markdown);
    let htmlPath = path.join(cwd, 'dist', html);
    let mdContent = fs.readFileSync(mdPath, 'utf-8');
    let md = new Markdown({ content: mdContent });
    let { attributes, body } = md.parseFrontMatter() as {
      attributes: {
        title: string | null;
      };
      body: string;
    };
    let htmlContent = await Markdown.parseMarkdown(body);
    fs.ensureDirSync(path.dirname(htmlPath));
    let isZhCN = mdPath.includes('/zh-CN/') || mdPath.endsWith('_zh-CN.md');
    let templatePath = path.join(cwd, isZhCN ? 'templates/default_zh-CN.ejs' : 'templates/default.ejs');
    let template = fs.readFileSync(templatePath, 'utf-8');
    let htmlContent2 = ejs.render(template, {
      content: htmlContent,
      editUrl: `https://github.com/umijs/makojs.dev/edit/master/docs/${markdown}`,
      title: attributes.title || '',
      isHome: html === 'index.html',
    });
    fs.writeFileSync(htmlPath, htmlContent2);
    console.log(`Built dist/${html}`);
  }

  // Copy index.html
  fs.copyFileSync(path.join(cwd, 'index.html'), path.join(cwd, 'dist/index.html'));
  fs.mkdirSync(path.join(cwd, 'dist/zh-CN'), { recursive: true });
  fs.copyFileSync(path.join(cwd, 'index_zh-CN.html'), path.join(cwd, 'dist/zh-CN/index.html'));

  // generate rss feed
  await new Collection({ dirPath: path.join(docsDir, 'blog') }).generateRssFeed();

  // generate llms.txt
  generateLLM();

  console.log('Building done!');
}

(async () => {
  if (require.main === module) {
    await main();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
