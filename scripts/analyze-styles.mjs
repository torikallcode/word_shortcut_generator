import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';

const zip = await JSZip.loadAsync(await readFile('fixtures/win/2021/after/Normal.dotm'));
const styles = await zip.file('word/styles.xml').async('string');

console.log('=== Defined styles ===');
for (const match of styles.matchAll(/<w:style\b([^>]*)>/g)) {
  const attrs = match[1];
  console.log(attrs);
}

console.log('\n=== Latent style exceptions (index = order, zero-based) ===');
const latent = [...styles.matchAll(/<w:lsdException\b([^>]*)\/>/g)];
console.log(`count=${latent.length}`);
latent.slice(0, 40).forEach((match, index) => {
  const name = /w:name="([^"]*)"/.exec(match[1])?.[1];
  console.log(`${String(index).padStart(3)} ${name}`);
});

const wanted = [
  'Normal',
  'heading 1',
  'heading 2',
  'Title',
  'Subtitle',
  'Quote',
  'Caption',
  'List Paragraph',
];
console.log('\n=== Indices for common styles ===');
latent.forEach((match, index) => {
  const name = /w:name="([^"]*)"/.exec(match[1])?.[1] ?? '';
  if (wanted.some((value) => value.toLowerCase() === name.toLowerCase())) {
    console.log(`${String(index).padStart(3)} ${name}`);
  }
});

console.log('\n=== Personal strings in parts ===');
for (const [name, entry] of Object.entries(zip.files)) {
  if (entry.dir) {
    continue;
  }
  const text = await entry.async('string');
  for (const needle of ['ACER RYZEN5', 'torikal akbar', 'C:\\Users', 'AppData']) {
    if (text.includes(needle)) {
      console.log(`${name}: contains "${needle}"`);
    }
  }
}
