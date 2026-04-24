#!/usr/bin/env node
/* Merge /tmp/case-study-images.jsonl into data/case-studies.json.
 * For every slug with scraped images:
 *   - set `gallery` to the full image list
 *   - replace `heroImage` with the first scraped image (better signal than
 *     the fabricated Cloudinary URLs, several of which 404)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'case-studies.json');
const JSONL_PATH = '/tmp/case-study-images.jsonl';

const raw = fs.readFileSync(DATA_PATH, 'utf8');
const data = JSON.parse(raw);

const scraped = fs
  .readFileSync(JSONL_PATH, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const bySlug = new Map(scraped.map((s) => [s.slug, s]));

let updated = 0;
let untouched = 0;

for (const study of data.studies) {
  const entry = bySlug.get(study.slug);
  const images = entry?.images ?? [];
  const videos = entry?.videos ?? [];
  if (images.length === 0 && videos.length === 0) {
    untouched++;
    continue;
  }
  if (images.length > 0) {
    study.gallery = images;
    // Prefer the first scraped image as hero — these are actually rendered on
    // the live site, unlike several of the fabricated Cloudinary URLs.
    study.heroImage = images[0];
    if (!study.heroImageAlt) {
      study.heroImageAlt = `${study.client} — ${study.projectTitle}`;
    }
  }
  if (videos.length > 0) {
    study.videos = videos;
  }
  updated++;
}

fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + '\n');

console.log(`Updated ${updated} studies · left ${untouched} unchanged`);
