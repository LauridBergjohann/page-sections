<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { VideoSectionData } from '@page-sections/core';
  import Section from './Section.svelte';
  let { section, children }: { section: Omit<VideoSectionData, 'type'>; children?: Snippet } = $props();
  function youtube(src: string): string | undefined {
    if (/^[\w-]{11}$/.test(src)) return `https://www.youtube-nocookie.com/embed/${src}`;
    try { const url = new URL(src); const allowed = ['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com', 'youtu.be']; if (!allowed.includes(url.hostname)) return; const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.searchParams.get('v') ?? url.pathname.split('/').pop(); return id && /^[\w-]{11}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : undefined; } catch { return; }
  }
</script>
{#snippet player()}
  {#if section.video.provider === 'youtube'}
    {#if youtube(section.video.src)}<iframe src={youtube(section.video.src)} title={section.headline ?? section.title} loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>{:else}<p>Invalid YouTube video URL.</p>{/if}
  {:else}
    <video controls playsinline preload="metadata" poster={section.video.poster} aria-label={section.headline ?? section.title}>
      <source src={section.video.src} />
      {#each section.video.captions ?? [] as track}<track kind="captions" src={track.src} srclang={track.language} label={track.label} />{/each}
      <a href={section.video.src}>Download video</a>
    </video>
  {/if}
{/snippet}
<Section {section}>{#if section.description || children}<div class="ps-media-pair" data-side={section.videoSide}>{@render player()}<div>{#if section.description}<p>{section.description}</p>{/if}{@render children?.()}</div></div>{:else}{@render player()}{/if}</Section>
<style>video, iframe { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; border-radius: var(--ps-radius); background: var(--ps-section-muted); }</style>
