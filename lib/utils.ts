import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with conditional class name support.
 * Last-wins semantics for conflicting utilities (via twMerge).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
