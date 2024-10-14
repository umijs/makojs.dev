import 'zx/globals';
import * as fs from 'fs';
import * as path from 'path';

// Read .env.json to get mako repo path
const envConfig = JSON.parse(fs.readFileSync('.env.json', 'utf-8'));
const makoRepoPath = envConfig.makoRepoPath;

// Define file mappings
const fileMappings = [
  { src: 'docs/config.md', dest: 'docs/docs/config.md' },
  { src: 'docs/config.zh-CN.md', dest: 'docs/zh-CN/docs/config.md' },
];

async function syncFile(srcPath: string, destPath: string) {
  const srcFullPath = path.join(makoRepoPath, srcPath);
  const destFullPath = path.join(process.cwd(), destPath);

  // Read source file
  const srcContent = await fs.promises.readFile(srcFullPath, 'utf-8');

  // Read destination file to preserve YAML front matter
  let destContent = '';
  try {
    destContent = await fs.promises.readFile(destFullPath, 'utf-8');
  } catch (error) {
    console.log(`Destination file ${destPath} not found. Creating new file.`);
  }

  // Extract YAML front matter from destination file
  const yamlMatch = destContent.match(/^---\n([\s\S]*?)\n---/);
  const yamlFrontMatter = yamlMatch ? yamlMatch[0] : '';

  // Combine YAML front matter with source content
  const newContent = yamlFrontMatter ? `${yamlFrontMatter}\n\n${srcContent}` : srcContent;

  // Write the combined content to the destination file
  await fs.promises.writeFile(destFullPath, newContent, 'utf-8');
  console.log(`Synced ${srcPath} to ${destPath}`);
}

async function main() {
  for (const mapping of fileMappings) {
    await syncFile(mapping.src, mapping.dest);
  }
  console.log('Sync completed successfully!');
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});
