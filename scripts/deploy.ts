import assert from 'assert';
import { spawnSync } from 'child_process';
import 'zx/globals';
import { build } from './build';

async function main() {
  await build();
  await deploy();
}

async function deploy() {
  console.log('Deploying...');
  let cwd = process.cwd();
  let envPath = path.join(cwd, '.env.json');
  assert(fs.existsSync(envPath), '.env.json not found');
  let env = JSON.parse(fs.readFileSync(envPath, 'utf-8'));
  let { deployScript } = env;
  assert(deployScript, 'deployScript not found in .env.json');
  let script = deployScript.split(' ');
  console.log('$', script.join(' '));
  spawnSync(script[0], script.slice(1), {
    cwd,
    stdio: 'inherit',
    shell: true,
  });
  console.log('Deploying done!');
}

(async () => {
  await main();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
