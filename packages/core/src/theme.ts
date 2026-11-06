import type { PageTheme } from './types.js';
const properties: Record<keyof PageTheme, string> = { background: 'background', ink: 'ink', body: 'body', accent: 'accent', onAccent: 'on-accent', standard: 'section-standard', muted: 'section-muted', radius: 'radius', narrowMax: 'narrow-max', fontFamily: 'font-family' };
export function themeStyle(theme: PageTheme = {}): string {
  return Object.entries(theme).map(([key, value]) => {
    if (!(key in properties) || /[;{}<>]/.test(value)) throw new Error(`Invalid theme property: ${key}`);
    return `--ps-${properties[key as keyof PageTheme]}:${value}`;
  }).join(';');
}
export function safeHref(href: string | undefined): string | undefined {
  if (href === undefined) return undefined;
  const normalized = href.replace(/[\u0000-\u0020\u007f]/g, '');
  return /^(?:https?:|mailto:|tel:)/i.test(normalized) || !/^[\w+.-]+:/.test(normalized) ? href : undefined;
}
