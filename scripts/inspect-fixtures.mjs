import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import JSZip from 'jszip';

const inputs = process.argv.slice(2);
if (inputs.length === 0) {
  console.error('Usage: node scripts/inspect-fixtures.mjs <file.dotm> [...] --out <dir>');
  process.exit(1);
}

const outIndex = inputs.indexOf('--out');
const outDir = outIndex === -1 ? null : resolve(inputs[outIndex + 1] ?? '.');
const files = (outIndex === -1 ? inputs : inputs.slice(0, outIndex)).map((file) => resolve(file));

for (const file of files) {
  const zip = await JSZip.loadAsync(await readFile(file));
  const names = Object.keys(zip.files).sort();
  const label = relative(process.cwd(), file).replaceAll('\\', '/').replaceAll('/', '__');

  console.log(`\n=== ${file} (${names.length} entries) ===`);
  for (const name of names) {
    const entry = zip.files[name];
    if (!entry) {
      continue;
    }
    if (entry.dir) {
      console.log(`DIR  ${name}`);
      continue;
    }
    const content = await entry.async('uint8array');
    const isText = /\.(xml|rels|txt)$/i.test(name);
    console.log(`FILE ${name} (${content.length} bytes${isText ? '' : ', binary'})`);
    if (isText) {
      console.log('-----');
      console.log(await entry.async('string'));
      console.log('-----');
    }
    if (outDir) {
      const target = join(outDir, label, name);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, content);
    }
  }
}
