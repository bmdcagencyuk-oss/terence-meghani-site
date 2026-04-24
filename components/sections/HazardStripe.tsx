const ITEMS = [
  { text: '★ Brand audit · 30 min · free', alt: false },
  { text: '🚀 2 slots · Q3 2026', alt: true },
  { text: '★ No decks · no fluff', alt: false },
  { text: '⚡ Book via hello@terencemeghani.com', alt: true },
];

export function HazardStripe() {
  // Duplicate the list so the marquee loop tiles seamlessly.
  const marquee = [...ITEMS, ...ITEMS];
  return (
    <div className="hazard" aria-hidden="true">
      <div className="h-text">
        {marquee.map((item, i) => (
          <span key={i} className={item.alt ? 'alt' : undefined}>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
