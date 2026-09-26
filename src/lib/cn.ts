import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving conflicts via tailwind-merge.
 * Accepts any number of string | undefined | null | false values.
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return twMerge(...(inputs.filter(Boolean) as string[]));
}
