import { expect, it } from 'vitest';
import { render } from 'svelte/server';
import CodeBlock from '../packages/svelte/src/CodeBlock.svelte';
import Sections from '../packages/svelte/src/Sections.svelte';
import { highlightCode } from '../packages/svelte/src/highlight.js';
import type { SectionData } from '@page-sections/core';

it('renders escaped source and line markers without a highlighting engine or JavaScript', () => {
  const code = '<script>alert("hello")</script>\nconst answer = 42;';
  const { body } = render(CodeBlock, { props: { code, language: 'javascript', lineNumbers: true, highlightLines: [2, 0, 99] } });
  expect(body).not.toContain('<script>');
  expect(body).toContain('&lt;script>');
  expect(body.match(/data-highlighted="true"/g)).toHaveLength(1);
  expect(body).toContain('aria-hidden="true">1</span>');
  expect(body).toContain('disabled');
  expect(body).toContain('tabindex="0"');
});

it('discards stale or incomplete token output instead of replacing the source', () => {
  const props = { code: 'const original = 42;', language: 'typescript' };
  const { body } = render(CodeBlock, { props: { ...props, highlighted: { ...props, lines: [[{ content: 'wrong source', color: '#ff0000' }]] } } });
  expect(body).toContain('const original = 42;');
  expect(body).not.toContain('wrong source');
  expect(body).not.toContain('#ff0000');
});

it('highlights source for both themes and preserves unknown languages as text', async () => {
  const highlighted = await highlightCode('const answer = 42;', 'ts');
  expect(highlighted.lines.flat().map(token => token.content).join('')).toBe(highlighted.code);
  expect(highlighted.lines.flat().some(token => token.color && token.darkColor)).toBe(true);
  const unknown = await highlightCode('<unknown>\r\nsecond line', 'toString');
  expect(unknown.lines.map(line => line.map(token => token.content).join('')).join('\n')).toBe('<unknown>\nsecond line');
  const { body } = render(CodeBlock, { props: { code: highlighted.code, language: 'ts', highlighted } });
  expect(body).toContain('--ps-code-light:');
  expect(body).toContain('--ps-code-dark:');
});

it('renders a JSON code section inside a responsive grid with supplied syntax tokens', async () => {
  const sections: SectionData[] = JSON.parse(JSON.stringify([{
    type: 'grid', id: 'pair', title: 'Explanation', blocks: [
      { id: 'text', span: { xs: 4, s: 3 }, sections: [{ type: 'richText', id: 'idea', title: 'Idea', blocks: [{ type: 'paragraph', text: 'A useful constant.' }] }] },
      { id: 'source', span: { xs: 4, s: 3 }, sections: [{ type: 'code', id: 'example', title: 'Example', headline: 'The code', code: 'const answer = 42;', language: 'typescript', tone: 'standard' }] }
    ]
  }]));
  const example = await highlightCode('const answer = 42;', 'typescript');
  const { body } = render(Sections, { props: { sections, codeHighlights: { example } } });
  expect(body).toContain('A useful constant.');
  expect(body).toContain('id="example-title"');
  expect(body).toContain('data-tone="standard"');
  expect(body).toContain('--ps-code-light:');
});
