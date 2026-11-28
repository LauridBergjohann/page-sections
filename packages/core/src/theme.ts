import type { PageTheme } from './types.js';
const properties: Record<keyof PageTheme, string> = { border: 'border', panelBorder: 'panel-border', panelBackground: 'panel-background', panelTintOpacity: 'panel-tint-opacity', panelBackdropBlur: 'panel-backdrop-blur', background: 'background', ink: 'ink', body: 'body', accent: 'accent', onAccent: 'on-accent', standard: 'section-standard', muted: 'section-muted', radius: 'radius', narrowMax: 'narrow-max', fontFamily: 'font-family', footerBorder: 'footer-border', footerBackground: 'footer-background', footerInk: 'footer-ink', footerRadius: 'footer-radius', footerShadow: 'footer-shadow', footerBarBackground: 'footer-bar-background', footerBarInk: 'footer-bar-ink' };
export function themeStyle(theme: PageTheme = {}): string {
  return Object.entries(theme).flatMap(([key, value]) => {
    if (!(key in properties)) throw new Error(`Invalid theme property: ${key}`);
    if (value === undefined) return [];
    if (key === 'panelTintOpacity' || key === 'panelBackdropBlur') {
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`Invalid theme property: ${key}`);
      const maximum = key === 'panelTintOpacity' ? 1 : 100;
      return `--ps-${properties[key]}:${Math.min(maximum, Math.max(0, value))}${key === 'panelBackdropBlur' ? 'px' : ''}`;
    }
    if (/[;{}<>]/.test(value)) throw new Error(`Invalid theme property: ${key}`);
    return `--ps-${properties[key as keyof PageTheme]}:${value}`;
  }).join(';');
}
export function safeHref(href: string | undefined): string | undefined {
  if (href === undefined) return undefined;
  const normalized = href.replace(/[\u0000-\u0020\u007f]/g, '');
  return /^(?:https?:|mailto:|tel:)/i.test(normalized) || !/^[\w+.-]+:/.test(normalized) ? href : undefined;
}
