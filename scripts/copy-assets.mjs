// tsc only emits JS and declarations; fonts, images and CSS are copied as-is so the consuming
// bundler resolves their url() references relative to dist/.
import { cpSync } from 'node:fs';

for (const dir of ['assets', 'styles']) {
  cpSync(new URL(`../src/${dir}`, import.meta.url), new URL(`../dist/${dir}`, import.meta.url), {
    recursive: true,
  });
}
