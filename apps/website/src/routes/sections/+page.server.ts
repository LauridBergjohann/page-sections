import { highlightCode } from '@page-sections/svelte/highlight';
import { sectionExample } from '$lib/sectionExamples';

export async function load() {
  const example = sectionExample('code');
  if (example.type !== 'code') throw new Error('Expected the code section example.');
  return {
    codeHighlights: { [example.id]: await highlightCode(example.code, example.language) }
  };
}
