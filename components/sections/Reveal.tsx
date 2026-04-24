'use client';

import {
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';

type Tag = 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

export type RevealVariant =
  | 'slide-up'
  | 'slide-down'
  | 'slide-side'
  | 'scale'
  | 'blur'
  | 'tilt'
  | 'letters'
  | 'pop';

type Props = {
  children: ReactNode;
  variant?: RevealVariant;
  as?: Tag;
  className?: string;
};

const SPLIT_LETTERS: ReadonlySet<RevealVariant> = new Set(['letters']);

/**
 * Reveal — in-view word/letter-split animation, ported from v23.
 *
 * The text is split on first render (client-side) so that server HTML
 * stays simple and SEO-friendly, then wrapped into .r-word / .r-letter
 * spans that CSS in globals.css animates via the .revealed class.
 */
export function Reveal({ children, variant = 'slide-up', as = 'span', className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const wrapWords = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (!text.trim()) return;
        const parts = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (p.trim()) {
            const outer = document.createElement('span');
            outer.className = 'r-word';
            const inner = document.createElement('span');
            inner.className = 'r-inner';
            inner.textContent = p;
            outer.appendChild(inner);
            frag.appendChild(outer);
          } else if (p.length) {
            frag.appendChild(document.createTextNode(p));
          }
        });
        (node as ChildNode).replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elNode = node as HTMLElement;
        if (
          elNode.classList &&
          (elNode.classList.contains('r-word') ||
            elNode.classList.contains('r-inner') ||
            elNode.classList.contains('r-letter'))
        ) {
          return;
        }
        Array.from(node.childNodes).forEach(wrapWords);
      }
    };

    const wrapLetters = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent ?? '';
        if (!text.trim()) return;
        const frag = document.createDocumentFragment();
        Array.from(text).forEach((ch) => {
          if (ch === ' ') {
            frag.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.className = 'r-letter';
            span.textContent = ch;
            frag.appendChild(span);
          }
        });
        (node as ChildNode).replaceWith(frag);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elNode = node as HTMLElement;
        if (elNode.classList && elNode.classList.contains('r-letter')) return;
        Array.from(node.childNodes).forEach(wrapLetters);
      }
    };

    const splitter = SPLIT_LETTERS.has(variant) ? wrapLetters : wrapWords;
    Array.from(el.childNodes).forEach(splitter);

    if (SPLIT_LETTERS.has(variant)) {
      el.querySelectorAll<HTMLElement>('.r-letter').forEach((l, i) => {
        l.style.setProperty('--i', String(i));
      });
    } else {
      el.querySelectorAll<HTMLElement>('.r-inner').forEach((inner, i) => {
        inner.style.setProperty('--i', String(i));
      });
    }

    if (!('IntersectionObserver' in window)) {
      el.classList.add('revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' },
    );
    observer.observe(el);

    // Fallback — reveal if already near the viewport
    const timer = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
        el.classList.add('revealed');
      }
    }, 150);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [variant]);

  const classes = `reveal ${className}`.trim();
  const commonProps = {
    'data-reveal': variant,
    className: classes,
  };

  switch (as) {
    case 'div':
      return (
        <div ref={ref as React.RefObject<HTMLDivElement>} {...(commonProps as ComponentPropsWithoutRef<'div'>)}>
          {children}
        </div>
      );
    case 'h1':
      return (
        <h1 ref={ref as React.RefObject<HTMLHeadingElement>} {...(commonProps as ComponentPropsWithoutRef<'h1'>)}>
          {children}
        </h1>
      );
    case 'h2':
      return (
        <h2 ref={ref as React.RefObject<HTMLHeadingElement>} {...(commonProps as ComponentPropsWithoutRef<'h2'>)}>
          {children}
        </h2>
      );
    case 'h3':
      return (
        <h3 ref={ref as React.RefObject<HTMLHeadingElement>} {...(commonProps as ComponentPropsWithoutRef<'h3'>)}>
          {children}
        </h3>
      );
    case 'h4':
      return (
        <h4 ref={ref as React.RefObject<HTMLHeadingElement>} {...(commonProps as ComponentPropsWithoutRef<'h4'>)}>
          {children}
        </h4>
      );
    case 'h5':
      return (
        <h5 ref={ref as React.RefObject<HTMLHeadingElement>} {...(commonProps as ComponentPropsWithoutRef<'h5'>)}>
          {children}
        </h5>
      );
    case 'h6':
      return (
        <h6 ref={ref as React.RefObject<HTMLHeadingElement>} {...(commonProps as ComponentPropsWithoutRef<'h6'>)}>
          {children}
        </h6>
      );
    case 'p':
      return (
        <p ref={ref as React.RefObject<HTMLParagraphElement>} {...(commonProps as ComponentPropsWithoutRef<'p'>)}>
          {children}
        </p>
      );
    default:
      return (
        <span ref={ref as React.RefObject<HTMLSpanElement>} {...(commonProps as ComponentPropsWithoutRef<'span'>)}>
          {children}
        </span>
      );
  }
}
