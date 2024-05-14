import { Feed } from 'feed';
import { Markdown } from './Markdown';

interface CollectionOpts {
  dirPath: string;
}

export class Collection {
  #opts: CollectionOpts;
  #mdFiles: {
    attributes: Record<string, any>;
    body: string;
    file: string;
    absFilePath: string;
  }[];
  constructor(opts: CollectionOpts) {
    this.#opts = opts;
    // @ts-ignore
    this.#mdFiles = fs.readdirSync(this.#opts.dirPath)
      .filter((file) => file.endsWith('.md') && file !== 'README.md')
      .map((file) => {
        let mdPath = path.join(this.#opts.dirPath, file);
        let { attributes, body } = new Markdown({
          content: fs.readFileSync(mdPath, 'utf-8'),
        }).parseFrontMatter();
        return {
          attributes,
          body,
          file,
          absFilePath: mdPath,
        }
      }).sort((a, b) => {
        // @ts-ignore
        return new Date(b.attributes.publishedAt).getTime() > new Date(a.attributes.publishedAt).getTime() ? 1 : -1;
      });
  }

  async generateRssFeed() {
    let baseUrl = 'https://makojs.dev';
    let feed = new Feed({
      link: baseUrl,
      id: 'rss@makojs.dev',
      title: 'Mako Blog',
      description: `Extremely fast, Production-grade web bundler.`,
      copyright: `sorrycc@gmail.com`,
    });
    for (let md of this.#mdFiles) {
      let url = `${baseUrl}/blog/${md.file.replace(/\.md$/, '')}`;
      let content = await Markdown.parseMarkdown(md.body);
      feed.addItem({
        id: url,
        link: url,
        title: md.attributes.title,
        content,
        date: new Date(md.attributes.publishedAt),
      });
    }
    fs.writeFileSync('dist/rss.xml', feed.atom1(), 'utf-8');
  }
}
