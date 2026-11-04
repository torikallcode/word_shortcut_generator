import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import JSZip from 'jszip';

const fixturePath = process.argv[2] ?? 'fixtures/win/2021/after/Normal.dotm';
const outputDir = process.argv[3] ?? 'src/data/base-package';
const EXCLUDED = new Set(['word/customizations.xml']);
const PERSONAL_NEEDLES = ['ACER RYZEN5', 'torikal akbar'];

const zip = await JSZip.loadAsync(await readFile(fixturePath));
const names = Object.keys(zip.files)
  .filter((name) => !zip.files[name]?.dir)
  .filter((name) => !EXCLUDED.has(name))
  .sort();

for (const name of names) {
  let content = await zip.file(name).async('string');

  if (name === 'docProps/core.xml') {
    content = content
      .replace(/<dc:creator>[\s\S]*?<\/dc:creator>/, '<dc:creator></dc:creator>')
      .replace(
        /<cp:lastModifiedBy>[\s\S]*?<\/cp:lastModifiedBy>/,
        '<cp:lastModifiedBy></cp:lastModifiedBy>',
      )
      .replace(/<cp:revision>[\s\S]*?<\/cp:revision>/, '<cp:revision>1</cp:revision>');
  }

  if (name === 'word/glossary/document.xml') {
    content = content.replace(/<w:docPart>[\s\S]*?<\/w:docPart>/g, (block) =>
      block.includes('<w:gallery w:val="autoTxt"/>') ? '' : block,
    );
  }

  for (const needle of PERSONAL_NEEDLES) {
    if (content.includes(needle)) {
      throw new Error(`Personal data "${needle}" still present in ${name}`);
    }
  }

  const target = join(outputDir, name);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
  console.log(`wrote ${target} (${content.length} chars)`);
}

console.log(`\nBase package built from ${fixturePath}: ${names.length} parts.`);
