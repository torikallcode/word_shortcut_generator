import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';

const afterPath = 'fixtures/win/2021/after/Normal.dotm';
const beforePath = 'fixtures/win/2021/before/Normal.dotm';

const [afterZip, beforeZip] = await Promise.all(
  [afterPath, beforePath].map(async (path) => JSZip.loadAsync(await readFile(path))),
);

console.log('=== Parts changed between before and after ===');
const names = [
  ...new Set([...Object.keys(beforeZip.files), ...Object.keys(afterZip.files)]),
].sort();
for (const name of names) {
  const before = beforeZip.file(name);
  const after = afterZip.file(name);
  if (!before && after) {
    console.log(`ADDED   ${name}`);
    continue;
  }
  if (before && !after) {
    console.log(`REMOVED ${name}`);
    continue;
  }
  if (!before || !after || before.dir || after.dir) {
    continue;
  }
  const [a, b] = await Promise.all([before.async('uint8array'), after.async('uint8array')]);
  const same = a.length === b.length && a.every((byte, index) => byte === b[index]);
  console.log(`${same ? 'same   ' : 'CHANGED'} ${name} (${a.length} -> ${b.length})`);
}

console.log('\n=== customizations.xml decoded ===');
const customizations = await afterZip.file('word/customizations.xml').async('string');
const keymaps = [
  ...customizations.matchAll(/<wne:keymap wne:kcmPrimary="([0-9A-F]{4})">(.*?)<\/wne:keymap>/g),
];
for (const match of keymaps) {
  const code = Number.parseInt(match[1], 16);
  const low = code & 0xff;
  const high = (code >> 8) & 0xff;
  console.log(
    `kcm=${match[1]} low=0x${low.toString(16).padStart(2, '0')} (${String.fromCharCode(low)}) high=0x${high
      .toString(16)
      .padStart(2, '0')} -> ${match[2]}`,
  );
}
const acds = [
  ...customizations.matchAll(
    /<wne:acd wne:argValue="([^"]+)" wne:acdName="([^"]+)" wne:fciIndexBasedOn="([^"]+)"\/>/g,
  ),
];
for (const [, argValue, name, fci] of acds) {
  const bytes = Buffer.from(argValue, 'base64');
  console.log(
    `acd ${name} fciIndexBasedOn=0x${fci} argValue=${argValue} bytes=${bytes.toString('hex')} uint16=${bytes.readUInt16LE(4)}`,
  );
}

console.log('\n=== Styles in word/styles.xml (document order) ===');
const styles = await afterZip.file('word/styles.xml').async('string');
const styleEntries = [...styles.matchAll(/<w:style ([^>]*)>(.*?)<\/w:style>/g)];
let paragraphIndex = 0;
for (const [index, attrs, body] of styleEntries) {
  const type = /w:type="([^"]+)"/.exec(attrs)?.[1] ?? '';
  const styleId = /w:styleId="([^"]+)"/.exec(attrs)?.[1] ?? '';
  const name = /<w:name w:val="([^"]+)"/.exec(body)?.[1] ?? '';
  const custom = /w:customStyle="1"/.test(attrs);
  const isDefault = /w:default="1"/.test(attrs);
  if (type === 'paragraph') {
    paragraphIndex += 1;
  }
  console.log(
    `xml#${index} ${type.padEnd(9)} paragraph#${String(paragraphIndex).padStart(2)} styleId=${styleId.padEnd(
      24,
    )} name="${name}"${custom ? ' CUSTOM' : ''}${isDefault ? ' DEFAULT' : ''}`,
  );
}

console.log('\n=== Glossary building blocks (word/glossary/document.xml) ===');
const glossary = await afterZip.file('word/glossary/document.xml').async('string');
const docParts = [...glossary.matchAll(/<w:docPart\b[^>]*w:name="([^"]*)"/g)].map((m) => m[1]);
console.log(`count=${docParts.length}`);
for (const name of docParts) {
  console.log(`- ${name}`);
}

console.log('\n=== docProps/core.xml ===');
console.log(await afterZip.file('docProps/core.xml').async('string'));
