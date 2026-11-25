<script lang="ts">
 import type { TimelineEvent } from '@page-sections/core';
 import Image from './Image.svelte';
 import Actions from './Actions.svelte';
 import RichTextContent from './RichTextContent.svelte';
 import { eventDateLabel } from './timeline.js';
 let { event, locale, presentLabel }: {event: TimelineEvent; locale?: string; presentLabel?: string} = $props();
 const date = $derived(eventDateLabel(event, locale, presentLabel));
</script>
    <p class="detail-date">{date}</p>
    {#if event.image}<div class="media"><Image image={{ ...event.image, aspect: event.image.aspect ?? '16/9' }} /></div>{/if}
    {#if event.description}<RichTextContent content={typeof event.description === 'string' ? { body: event.description, format: 'text' } : event.description} />{/if}
    {#if event.tags?.length}<ul class="tags" aria-label="Tags">{#each event.tags as tag}<li>{tag}</li>{/each}</ul>{/if}
    {#if event.action}<Actions actions={[event.action]} />{/if}

<style>
  .detail-date { color: var(--ps-body); font-size: .8rem; }
  .detail-date { margin: -.25rem 0 .75rem; }
  .media { margin-block: .75rem; max-height: 180px; overflow: hidden; border-radius: var(--ps-radius); }
  .media :global(img) { max-height: 180px; }
  .tags { display: flex; gap: .4rem; flex-wrap: wrap; padding: 0; margin: .75rem 0; list-style: none; }
  .tags li { padding: .15rem .6rem; border-radius: 999px; background: color-mix(in srgb, var(--timeline-color) 14%, var(--ps-section-standard)); color: var(--ps-ink); font-size: .75rem; }
</style>
