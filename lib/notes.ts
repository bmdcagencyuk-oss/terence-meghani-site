import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type NoteTag =
  | 'engineering'
  | 'brand'
  | 'process'
  | 'opinion'
  | 'wordpress'
  | 'ai';

export const NOTE_TAGS: readonly NoteTag[] = [
  'engineering',
  'brand',
  'process',
  'opinion',
  'wordpress',
  'ai',
] as const;

export type NoteFrontmatter = {
  slug: string;
  title: string;
  /** ISO 8601 — used for display and RSS pubDate. */
  date: string;
  /** Manual reading time in minutes. */
  readingTime: number;
  tags: NoteTag[];
  excerpt: string;
  heroImage: string;
  heroImageAlt: string;
  published: boolean;
  author: string;
};

export type Note = NoteFrontmatter & {
  /** Raw MDX body (frontmatter stripped). */
  body: string;
};

const contentDir = path.join(process.cwd(), 'content', 'notes');

function readAll(): Note[] {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, file), 'utf8');
    const { data, content } = matter(raw);
    const fm = data as Partial<NoteFrontmatter> & { heroAlt?: string };
    return {
      slug: fm.slug ?? file.replace(/\.mdx$/, ''),
      title: fm.title ?? 'Untitled',
      date: fm.date ?? '1970-01-01',
      readingTime: fm.readingTime ?? 1,
      tags: (fm.tags ?? []) as NoteTag[],
      excerpt: fm.excerpt ?? '',
      heroImage: fm.heroImage ?? '',
      // Accept either heroImageAlt or the shorter heroAlt alias.
      heroImageAlt: fm.heroImageAlt ?? fm.heroAlt ?? '',
      published: fm.published === true,
      author: fm.author ?? 'Terence Meghani',
      body: content,
    };
  });
}

// Cache only in production. In dev we re-read so MDX edits show up
// without restarting the server.
let cache: Note[] | null = null;
function loadAll(): Note[] {
  if (process.env.NODE_ENV === 'production' && cache) return cache;
  const all = readAll().sort((a, b) => (a.date < b.date ? 1 : -1));
  if (process.env.NODE_ENV === 'production') cache = all;
  return all;
}

export function getAllNotes(): Note[] {
  return loadAll().filter((n) => n.published);
}

export function getNoteBySlug(slug: string): Note | undefined {
  return loadAll().find((n) => n.slug === slug && n.published);
}

export function getNotesByTag(tag: string): Note[] {
  const t = tag.toLowerCase();
  return getAllNotes().filter((n) => n.tags.some((x) => x.toLowerCase() === t));
}

export function getRecentNotes(limit: number): Note[] {
  return getAllNotes().slice(0, limit);
}

export function getAllTags(): NoteTag[] {
  const seen = new Set<NoteTag>();
  for (const n of getAllNotes()) for (const t of n.tags) seen.add(t);
  return NOTE_TAGS.filter((t) => seen.has(t));
}

/** "May 2026" — used in cards and bylines. */
export function formatNoteDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

/** "1 May 2026" — used in JSON-LD context where day matters. */
export function formatNoteDateLong(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}
