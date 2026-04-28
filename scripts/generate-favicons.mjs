// Generate the full favicon set from public/brand/emblem-gorilla.svg.
//
// Outputs (all under public/):
//   favicon.ico (multi-resolution 16/32/48 — simplified glyph)
//   icon-16.png, icon-32.png — simplified glyph (T·M monogram)
//   icon-192.png, icon-512.png — full gorilla emblem, transparent bg
//   apple-touch-icon.png (180×180) — full emblem on dark plinth
//   icon-maskable-192.png, icon-maskable-512.png — emblem on dark plinth, 80% safe-zone
//
// Run with `node scripts/generate-favicons.mjs`. Generated PNGs are
// committed; do not regenerate during the build.

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const ROOT = resolve(dirname(__filename), '..');
const PUBLIC = resolve(ROOT, 'public');
const SOURCE_EMBLEM = resolve(PUBLIC, 'brand/emblem-gorilla.svg');

const DARK_PLINTH = '#0a0a0a';

/**
 * Simplified glyph for sub-32px sizes — the silverback emblem is too detailed
 * to read at favicon resolution. We render a stylised "T·M" monogram in white
 * on the dark theme colour using an inline SVG sharp can rasterise.
 */
const MONOGRAM_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${DARK_PLINTH}"/>
  <text x="32" y="44"
        text-anchor="middle"
        font-family="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        font-size="38" font-weight="700" letter-spacing="-2"
        fill="#FFFFFF">T·M</text>
</svg>
`.trim();

/** Render the gorilla emblem as a white silhouette on a transparent canvas. */
async function emblemWhiteOnTransparent(size) {
  // Source the emblem at hi-res, then recolour to white via a composite:
  // 1) extract the emblem alpha/mask
  // 2) flood the masked region with white
  const emblem = await sharp(SOURCE_EMBLEM)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  // Convert non-transparent pixels to white while preserving alpha
  const { data, info } = await sharp(emblem)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Compose the white emblem onto a dark plinth at given size with safe-zone. */
async function emblemOnPlinth(size, scale = 0.7) {
  const emblemSize = Math.round(size * scale);
  const emblem = await emblemWhiteOnTransparent(emblemSize);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: DARK_PLINTH,
    },
  })
    .composite([{ input: emblem, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** Render the simplified monogram at given size on the dark plinth. */
async function monogram(size) {
  return sharp(Buffer.from(MONOGRAM_SVG))
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function writeFavicon() {
  // Multi-resolution .ico from the simplified glyph
  const png16 = await monogram(16);
  const png32 = await monogram(32);
  const png48 = await monogram(48);
  const ico = await pngToIco([png16, png32, png48]);
  await writeFile(resolve(PUBLIC, 'favicon.ico'), ico);
  console.log('✓ favicon.ico (16/32/48 monogram)');

  // App-icon entries reference the same monogram for sub-32 sizes
  await writeFile(resolve(PUBLIC, 'icon-16.png'), png16);
  await writeFile(resolve(PUBLIC, 'icon-32.png'), png32);
  console.log('✓ icon-16.png / icon-32.png (monogram)');
}

async function writeFullEmblemIcons() {
  const png192 = await emblemWhiteOnTransparent(192);
  const png512 = await emblemWhiteOnTransparent(512);
  await writeFile(resolve(PUBLIC, 'icon-192.png'), png192);
  await writeFile(resolve(PUBLIC, 'icon-512.png'), png512);
  console.log('✓ icon-192.png / icon-512.png (white emblem, transparent bg)');

  const apple = await emblemOnPlinth(180, 0.7);
  await writeFile(resolve(PUBLIC, 'apple-touch-icon.png'), apple);
  console.log('✓ apple-touch-icon.png (180×180, plinth)');

  const mask192 = await emblemOnPlinth(192, 0.8);
  const mask512 = await emblemOnPlinth(512, 0.8);
  await writeFile(resolve(PUBLIC, 'icon-maskable-192.png'), mask192);
  await writeFile(resolve(PUBLIC, 'icon-maskable-512.png'), mask512);
  console.log('✓ icon-maskable-192.png / icon-maskable-512.png (plinth, 80% safe-zone)');
}

await writeFavicon();
await writeFullEmblemIcons();
console.log('Done.');
