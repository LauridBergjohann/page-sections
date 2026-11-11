<script lang="ts">
  import { getContext, onMount } from 'svelte';
  import type { CodeData, HighlightedCode } from '@page-sections/core';
  import { THEME_MODE, type ReadThemeMode } from './themeContext.js';
  import './styles.css';

  type Props = CodeData & {
    highlighted?: HighlightedCode;
    copy?: boolean;
    label?: string;
    copyLabel?: string;
    copiedLabel?: string;
    copyErrorLabel?: string;
  };
  let {
    code, language = 'text', filename, lineNumbers = false, highlightLines = [],
    wrap = false, tone = 'muted', highlighted, copy = true, label = 'Code example',
    copyLabel = 'Copy code', copiedLabel = 'Copied', copyErrorLabel = 'Copy failed. Select and copy the code manually.'
  }: Props = $props();
  const readMode = getContext<ReadThemeMode | undefined>(THEME_MODE);
  const mode = $derived(readMode?.() ?? 'light');
  let canCopy = $state(false);
  let message = $state('');
  onMount(() => { canCopy = typeof navigator.clipboard?.writeText === 'function'; });
  $effect(() => { code; language; message = ''; });
  const lines = $derived.by((): HighlightedCode['lines'] => {
    const normalized = code.replace(/\r\n?/g, '\n');
    if (highlighted?.code === code && highlighted.language === language &&
        highlighted.lines.map(line => line.map(token => token.content).join('')).join('\n') === normalized) {
      return highlighted.lines;
    }
    return normalized.split('\n').map(content => [{ content }]);
  });
  function color(value: string | undefined) {
    return value && /^#[\da-f]{3,8}$/i.test(value) ? value : undefined;
  }
  async function copyCode() {
    const source = code;
    try {
      await navigator.clipboard.writeText(source);
      if (source === code) message = copiedLabel;
    } catch {
      if (source === code) message = copyErrorLabel;
    }
  }
</script>

<figure class="ps-code-block" data-tone={tone} data-code-mode={mode} data-wrap={wrap}>
  {#if filename}<figcaption class="filename">{filename}</figcaption>{/if}
  <div class="tools" title={filename}>
    <span class="language">{language}</span>
    {#if copy}<button type="button" disabled={!canCopy} onclick={copyCode} aria-label={copyLabel} title={message || copyLabel}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        {#if message === copiedLabel}<path d="m5 12 4 4L19 6" />{:else}<rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />{/if}
      </svg>
    </button>{/if}
  </div>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Scrollable source must be keyboard accessible without JavaScript.) -->
  <pre tabindex="0" role="region" aria-label={label}><code>{#each lines as line, index}<span class="code-line" data-highlighted={highlightLines.includes(index + 1)}>{#if lineNumbers}<span class="line-number" aria-hidden="true">{index + 1}</span>{/if}{#each line as token}<span style:--ps-code-light={color(token.color)} style:--ps-code-dark={color(token.darkColor)} style:font-style={(token.fontStyle ?? 0) & 1 ? 'italic' : undefined} style:font-weight={(token.fontStyle ?? 0) & 2 ? 'bold' : undefined} style:text-decoration={(token.fontStyle ?? 0) & 4 ? 'underline' : undefined}>{token.content}</span>{/each}</span>{index < lines.length - 1 ? '\n' : ''}{/each}</code></pre>
  <span class="copy-status" role="status">{message}</span>
</figure>

<style>
  .ps-code-block { position: relative; display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: start; margin: 0; min-width: 0; max-width: 100%; overflow: hidden; border: 1px solid var(--ps-border); border-radius: var(--ps-radius); background: var(--ps-section-muted); color: var(--ps-ink); }
  [data-tone='standard'] { background: var(--ps-section-standard); }
  .tools { grid-column: 2; grid-row: 1; display: flex; align-items: center; gap: .35rem; padding: .5rem .5rem .5rem 0; font: .7rem/1.2 var(--ps-font-family); }
  .language { max-width: 9ch; overflow: hidden; text-overflow: ellipsis; color: var(--ps-body); }
  button { display: grid; place-items: center; width: 28px; height: 28px; padding: 0; border: 0; border-radius: .35rem; background: transparent; color: var(--ps-body); cursor: pointer; }
  button:hover { background: var(--ps-section-standard); color: var(--ps-accent); }
  button:disabled { opacity: .5; cursor: default; }
  button:focus-visible, pre:focus-visible { outline: 2px solid var(--ps-accent); outline-offset: -2px; }
  pre { grid-column: 1; grid-row: 1; min-width: 0; margin: 0; padding: .75rem 0; overflow: auto; tab-size: 2; font: .875rem/1.65 ui-monospace, SFMono-Regular, Consolas, monospace; }
  code { font: inherit; }
  .code-line { display: inline-block; box-sizing: border-box; min-width: 100%; padding-inline: 1rem; }
  .line-number { display: inline-block; min-width: 3ch; padding-inline-end: 1.5ch; text-align: end; color: var(--ps-body); user-select: none; }
  [data-highlighted='true'] { background: color-mix(in srgb, var(--ps-accent) 12%, transparent); box-shadow: inset 3px 0 var(--ps-accent); }
  .code-line > span:not(.line-number) { color: var(--ps-code-light, inherit); }
  [data-code-mode='dark'] .code-line > span:not(.line-number) { color: var(--ps-code-dark, inherit); }
  @media (prefers-color-scheme: dark) { .ps-code-block:not([data-code-mode='light']) .code-line > span:not(.line-number) { color: var(--ps-code-dark, inherit); } }
  [data-wrap='true'] pre { white-space: pre-wrap; overflow-wrap: anywhere; }
  .filename, .copy-status { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
</style>
