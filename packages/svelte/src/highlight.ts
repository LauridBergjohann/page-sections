import type { HighlightedCode } from '@page-sections/core';

/** Optional entry point. Install the Shiki peer in hosts that need syntax colors.
 * Call at build/server time to keep grammars and the engine out of browser bundles.
 * Unknown languages degrade to escaped plain text; no source is executed.
 */
export async function highlightCode(code: string, language = 'text'): Promise<HighlightedCode> {
  const { codeToTokensWithThemes, bundledLanguages, bundledLanguagesAlias } = await import('shiki');
  const lang = Object.hasOwn(bundledLanguages, language) || Object.hasOwn(bundledLanguagesAlias, language) ? language : 'text';
  const result = await codeToTokensWithThemes(code.replace(/\r\n?/g, '\n'), {
    lang: lang as keyof typeof bundledLanguages,
    themes: { light: 'github-light', dark: 'github-dark' }
  });
  return {
    code, language,
    lines: result.map(line => line.map(token => ({
      content: token.content,
      color: token.variants.light.color,
      darkColor: token.variants.dark.color,
      fontStyle: token.variants.light.fontStyle
    })))
  };
}
