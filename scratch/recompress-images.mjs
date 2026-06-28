import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';

const root = path.resolve(import.meta.dirname, '..', 'public');
const MIN_SIZE = 30 * 1024; // skip tiny files, not worth the risk/time

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let totalBefore = 0;
let totalAfter = 0;
let count = 0;

for await (const file of walk(root)) {
  const ext = path.extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  const before = (await stat(file)).size;
  if (before < MIN_SIZE) continue;

  const input = await sharp(file, { failOn: 'none' }).toBuffer();
  let output;
  try {
    if (ext === '.png') {
      output = await sharp(input).png({ compressionLevel: 9, effort: 10 }).toBuffer();
    } else {
      output = await sharp(input).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
    }
  } catch (e) {
    console.error(`skip (error): ${file} — ${e.message}`);
    continue;
  }

  if (output.length < before) {
    await sharp(output).toFile(file);
    totalBefore += before;
    totalAfter += output.length;
    count++;
    console.log(`${path.relative(root, file)}: ${(before / 1024).toFixed(0)}KB -> ${(output.length / 1024).toFixed(0)}KB`);
  } else {
    console.log(`${path.relative(root, file)}: no gain, kept original`);
  }
}

console.log('---');
console.log(`recompressed ${count} files`);
console.log(`${(totalBefore / 1024 / 1024).toFixed(2)}MB -> ${(totalAfter / 1024 / 1024).toFixed(2)}MB (saved ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)}MB)`);
