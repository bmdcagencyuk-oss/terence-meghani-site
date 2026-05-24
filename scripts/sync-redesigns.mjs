#!/usr/bin/env node
/**
 * scripts/sync-redesigns.mjs
 *
 * Syncs pipeline output (~/Sites/tm-redesign-pipeline) into this Next.js repo.
 *
 * For each demo in the pipeline:
 *   - Copies the HTML demo to public/redesigns/{slug}/
 *   - Copies before-desktop.png alongside
 *   - Copies audit.json to data/redesigns/{slug}.json
 *
 * Usage:
 *   node scripts/sync-redesigns.mjs                       # default pipeline location
 *   node scripts/sync-redesigns.mjs --pipeline=/path/to/  # explicit path
 *   node scripts/sync-redesigns.mjs --only=il-pellegrino  # sync one demo
 *   node scripts/sync-redesigns.mjs --clean               # wipe old demos first
 *
 * After running: review the diff in GitHub Desktop, commit, push.
 */

import { readdir, mkdir, copyFile, rm, stat, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

const PIPELINE_DIR = resolve(
  args.pipeline ?? process.env.PIPELINE_DIR ?? `${homedir()}/Sites/tm-redesign-pipeline`
);
const ONLY = args.only;
const CLEAN = args.clean === true;

if (!existsSync(PIPELINE_DIR)) {
  console.error(`\n❌ Pipeline not found at: ${PIPELINE_DIR}`);
  console.error(`   Pass --pipeline=/path/to/tm-redesign-pipeline or set PIPELINE_DIR env var.\n`);
  process.exit(1);
}

const PIPELINE_DEMOS = resolve(PIPELINE_DIR, 'demos');
const PIPELINE_AUDITS = resolve(PIPELINE_DIR, 'data/audits');
const PUBLIC_DIR = resolve(REPO_ROOT, 'public/redesigns');
const DATA_DIR = resolve(REPO_ROOT, 'data/redesigns');

async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = resolve(src, entry.name);
    const d = resolve(dst, entry.name);
    if (entry.isDirectory()) {
      await copyDir(s, d);
    } else {
      await copyFile(s, d);
    }
  }
}

async function syncOne(slug) {
  const demoSrc = resolve(PIPELINE_DEMOS, slug);
  const auditSrc = resolve(PIPELINE_AUDITS, slug);
  const auditJson = resolve(auditSrc, 'audit.json');
  const beforeShot = resolve(auditSrc, 'before-desktop.png');

  if (!existsSync(demoSrc)) {
    console.log(`  ⚠ ${slug} — no demo built yet (run scripts/04-demo-init.mjs first)`);
    return false;
  }
  if (!existsSync(auditJson)) {
    console.log(`  ⚠ ${slug} — no audit.json found`);
    return false;
  }

  // Copy demo files → public/redesigns/{slug}/
  const publicSlugDir = resolve(PUBLIC_DIR, slug);
  if (existsSync(publicSlugDir)) await rm(publicSlugDir, { recursive: true });
  await copyDir(demoSrc, publicSlugDir);

  // Copy before-screenshot alongside the demo
  if (existsSync(beforeShot)) {
    await copyFile(beforeShot, resolve(publicSlugDir, 'before-desktop.png'));
  }

  // Copy audit JSON → data/redesigns/{slug}.json
  await mkdir(DATA_DIR, { recursive: true });
  await copyFile(auditJson, resolve(DATA_DIR, `${slug}.json`));

  console.log(`  ✓ ${slug}`);
  return true;
}

async function main() {
  console.log(`\nSyncing from: ${PIPELINE_DIR}`);
  console.log(`         → ${REPO_ROOT}\n`);

  if (CLEAN) {
    console.log('Cleaning existing demos…');
    if (existsSync(PUBLIC_DIR)) await rm(PUBLIC_DIR, { recursive: true });
    if (existsSync(DATA_DIR)) await rm(DATA_DIR, { recursive: true });
  }

  if (!existsSync(PIPELINE_DEMOS)) {
    console.error(`No demos directory at ${PIPELINE_DEMOS}. Build some demos first.`);
    process.exit(1);
  }

  const slugs = ONLY
    ? [ONLY]
    : (await readdir(PIPELINE_DEMOS, { withFileTypes: true }))
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

  if (slugs.length === 0) {
    console.log('No demos to sync.');
    return;
  }

  let synced = 0;
  for (const slug of slugs) {
    if (await syncOne(slug)) synced++;
  }

  console.log(`\nSynced ${synced}/${slugs.length} demos.`);
  console.log(`\nNext:\n  1. Review diff in GitHub Desktop\n  2. Commit: "Sync redesign demos: ${slugs.slice(0, 3).join(', ')}${slugs.length > 3 ? '…' : ''}"\n  3. Push → Vercel auto-deploys\n`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
