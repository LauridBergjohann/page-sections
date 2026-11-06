<script lang="ts">
  import { setContext, type Snippet } from 'svelte';
  import { THEME_MODE } from './themeContext.js';
  import { themeStyle, type PageTheme } from '@page-sections/core';
  import './styles.css';
  let { theme, mode, children }: { theme?: PageTheme; mode?: 'light' | 'dark'; children?: Snippet } = $props();
  setContext(THEME_MODE, () => mode);
</script>
<div class="ps-shell" data-ps-theme={mode} style={themeStyle(theme)}>{@render children?.()}</div>
