import sharp from 'sharp';
import { mkdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { signs } from './data.js';

await mkdir('public/media', { recursive: true });
const rectangles = new Map();
const addRow = (first, count, centers, top, width, height) => {
  for (let index = 0; index < count; index++) rectangles.set(first + index, { left: Math.round(centers[index] - width / 2), top, width, height });
};
const firstCenters = [105, 157, 208, 259, 310, 361, 411, 463];
addRow(1, 8, firstCenters, 78, 43, 38);
addRow(9, 8, firstCenters, 137, 43, 43);
addRow(17, 7, [105, 157, 208, 284, 361, 412, 463], 201, 46, 40);
rectangles.set(20, { left: 257, top: 201, width: 58, height: 48 });
rectangles.set(22, { left: 392, top: 199, width: 50, height: 47 });
rectangles.set(23, { left: 449, top: 199, width: 40, height: 48 });
addRow(24, 7, [134, 211, 261, 312, 365, 417, 470], 263, 76, 44);
for (const [first, top] of [[31, 318], [38, 371], [45, 426], [52, 481]]) addRow(first, 7, [115, 171, 228, 285, 341, 398, 455], top, 54, 44);
rectangles.set(57, { left: 371, top: 476, width: 54, height: 49 });
addRow(59, 5, [115, 201, 286, 373, 460], 538, 79, 49);
addRow(64, 5, [115, 201, 286, 373, 460], 598, 79, 53);

const secondCenters = [58, 130, 204, 276, 349, 420, 493];
const secondRows = [67, 114, 163, 213, 266, 320, 373, 427];
for (let row = 0; row < secondRows.length; row++) addRow(70 + row * 7, 7, secondCenters, secondRows[row], 60, 43);
addRow(126, 3, [119, 279, 434], 490, 165, 28);
rectangles.set(127, { left: 244, top: 484, width: 56, height: 41 });
addRow(129, 7, [58, 129, 201, 274, 346, 418, 491], 532, 57, 40);
addRow(136, 6, [57, 135, 217, 308, 399, 480], 583, 63, 38);

function isolateSign(data, info) {
  const visited = new Uint8Array(info.width * info.height);
  let largest = { pixels: 0 };
  for (let pixel = 0; pixel < visited.length; pixel++) {
    if (visited[pixel]) continue;
    visited[pixel] = 1;
    if (Math.min(...data.subarray(pixel * 3, pixel * 3 + 3)) >= 225) continue;
    const pending = [pixel];
    let pixels = 0;
    let left = info.width;
    let right = 0;
    let top = info.height;
    let bottom = 0;
    while (pending.length) {
      const current = pending.pop();
      const column = current % info.width;
      const row = Math.floor(current / info.width);
      pixels++;
      left = Math.min(left, column);
      right = Math.max(right, column);
      top = Math.min(top, row);
      bottom = Math.max(bottom, row);
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        for (let offsetX = -1; offsetX <= 1; offsetX++) {
          const nextX = column + offsetX;
          const nextY = row + offsetY;
          if (nextX < 0 || nextX >= info.width || nextY < 0 || nextY >= info.height) continue;
          const next = nextY * info.width + nextX;
          if (visited[next]) continue;
          visited[next] = 1;
          if (Math.min(...data.subarray(next * 3, next * 3 + 3)) < 225) pending.push(next);
        }
      }
    }
    if (pixels > largest.pixels) largest = { pixels, left, top, width: right - left + 1, height: bottom - top + 1 };
  }
  if (largest.pixels < 40) throw new Error('No complete sign found in crop');
  const { left, top, width, height } = largest;
  return { left, top, width, height };
}

function maskSignFace(data, info, number) {
  const spans = [];
  for (let row = 0; row < info.height; row++) {
    let left = info.width;
    let right = -1;
    for (let column = 0; column < info.width; column++) {
      const channels = data.subarray((row * info.width + column) * 3, (row * info.width + column) * 3 + 3);
      if (Math.max(...channels) - Math.min(...channels) > 45 && Math.max(...channels) > 80) {
        left = Math.min(left, column);
        right = Math.max(right, column);
      }
    }
    spans.push({ left, right });
  }
  const masked = Buffer.alloc(data.length, 255);
  const diamond = (number >= 31 && number <= 51) || (number >= 56 && number <= 58) || (number >= 70 && number <= 125) || number === 127;
  const firstRow = spans.findIndex(span => span.right >= 0);
  const lastRow = spans.findLastIndex(span => span.right >= 0);
  const widest = spans.reduce((best, span) => span.right - span.left > best.right - best.left ? span : best, spans[firstRow]);
  const centre = number === 123 ? 27 : (widest.left + widest.right) / 2;
  for (let row = 0; row < info.height; row++) {
    let left = info.width;
    let right = -1;
    for (let nearby = Math.max(0, row - 2); nearby <= Math.min(info.height - 1, row + 2); nearby++) {
      if (spans[nearby].right < 0) continue;
      left = Math.min(left, spans[nearby].left - 2);
      right = Math.max(right, spans[nearby].right + 2);
    }
    if (diamond) {
      const top = firstRow - 2;
      const bottom = lastRow + 2;
      const middle = (top + bottom) / 2;
      const fraction = Math.max(0, 1 - Math.abs(row - middle) / ((bottom - top) / 2));
      const halfWidth = number === 123 ? 26 : (widest.right - widest.left) / 2 + 2;
      left = Math.ceil(centre - halfWidth * fraction - 1);
      right = Math.floor(centre + halfWidth * fraction + 1);
      if (row < top || row > bottom) continue;
    }
    for (let column = Math.max(0, left); column <= Math.min(info.width - 1, right); column++) {
      const offset = (row * info.width + column) * 3;
      data.copy(masked, offset, offset, offset + 3);
    }
  }
  return masked;
}

const audit = [];
for (const sign of signs) {
  const input = sign.number <= 68 ? 'signs-image1.png' : 'signs-image3.png';
  const region = rectangles.get(sign.number);
  const { data, info } = await sharp(`public/media/${input}`).extract(region).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const monochrome = [9, 20, 23, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68].includes(sign.number);
  const multiPart = sign.number === 20 || sign.number === 23 || sign.number >= 137;
  const pixels = monochrome || multiPart ? data : maskSignFace(data, info, sign.number);
  const bounds = multiPart ? { left: 0, top: 0, width: info.width, height: info.height } : isolateSign(pixels, info);
  const output = await sharp(pixels, { raw: info }).extract(bounds).extend({ top: 3, bottom: 3, left: 3, right: 3, background: '#ffffff' }).png().toBuffer();
  await sharp(output).toFile(`public/media/sign-${sign.number}.png`);
  audit.push({ number: sign.number, output });
}
console.log(`Extracted ${signs.length} individual signs.`);

if (process.argv.includes('--audit')) {
  const directory = await mkdtemp(join(tmpdir(), 'road-ready-signs-'));
  for (let start = 0; start < audit.length; start += 35) {
    const composites = [];
    for (const [index, entry] of audit.slice(start, start + 35).entries()) {
      const left = index % 7 * 150;
      const top = Math.floor(index / 7) * 125;
      composites.push({ input: await sharp(entry.output).resize(130, 90, { fit: 'contain', background: '#ffffff' }).toBuffer(), left: left + 10, top: top + 25 });
      composites.push({ input: Buffer.from(`<svg width="150" height="25"><text x="75" y="19" text-anchor="middle" font-size="16">${entry.number}</text></svg>`), left, top });
    }
    const path = join(directory, `audit-${start / 35 + 1}.png`);
    await sharp({ create: { width: 1050, height: 625, channels: 3, background: '#ffffff' } }).composite(composites).png().toFile(path);
    console.log(path);
  }
}