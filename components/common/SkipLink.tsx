import Link from 'next/link';

export function SkipLink() {
  return (
    <Link
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-rocket focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
    >
      Skip to main content
    </Link>
  );
}
