import { getAllNotes } from '@/lib/notes';
import { absoluteUrl, SITE } from '@/lib/site';

const FEED_TITLE = 'Notes from Terence Meghani Studio';
const FEED_DESCRIPTION =
  'Working notes on brand, engineering, and the intersection between them.';

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const dynamic = 'force-static';

export function GET() {
  const notes = getAllNotes();
  const selfUrl = absoluteUrl('/notes/feed.xml');
  const indexUrl = absoluteUrl('/notes/');
  const lastBuildDate = new Date().toUTCString();

  const items = notes
    .map((n) => {
      const link = absoluteUrl(`/notes/${n.slug}/`);
      const pubDate = new Date(n.date).toUTCString();
      const tagsXml = n.tags
        .map((t) => `<category>${escape(t)}</category>`)
        .join('');
      // Excerpt-only — drives traffic back to the site, per editorial choice.
      return `
    <item>
      <title>${escape(n.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escape(n.excerpt)}</description>
      <author>hello@terencemeghani.com (${escape(n.author)})</author>
      ${tagsXml}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(FEED_TITLE)}</title>
    <link>${indexUrl}</link>
    <description>${escape(FEED_DESCRIPTION)}</description>
    <language>${SITE.locale}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
