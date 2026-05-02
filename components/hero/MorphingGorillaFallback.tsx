/* Static fallback for the WebGL morphing gorilla. Rendered on viewports
   below the desktop breakpoint, when the user prefers reduced motion, or
   when ?nomorph=1 is set. The SVG is a stylised approximation of the
   final loop stage (rendered website mockup with a small gorilla emblem
   in the nav). next/image refuses SVGs unless dangerouslyAllowSVG is
   enabled, so we use a plain <img> — the asset is ours and ~10KB. */
export function MorphingGorillaFallback() {
  return (
    <div className="hero-morph-canvas hero-morph-canvas--static" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/morph-static-stage5.svg"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export default MorphingGorillaFallback;
