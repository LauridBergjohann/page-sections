<script lang="ts">
  import {
    PrimaryButton,
    SecondaryButton,
    IconButton,
    Popup,
    ButtonGroup
  } from '@page-sections/svelte';
  import Settings from '@lucide/svelte/icons/settings';
  import Sun from '@lucide/svelte/icons/sun';
  import Moon from '@lucide/svelte/icons/moon';
  let { kind = 'popup' }: { kind?: 'buttons' | 'popup' | 'group' } = $props();
  let open = $state(false);
  let anchor = $state<HTMLButtonElement | HTMLAnchorElement>();
  let value = $state('light');
  let count = $state(0);
</script>

<div class="demo" data-atomic-preview={kind}>
  {#if kind === 'buttons'}
    <PrimaryButton onclick={() => count++}>Primary action</PrimaryButton>
    <SecondaryButton onclick={() => (count = 0)}>Reset count</SecondaryButton>
    <PrimaryButton disabled>Disabled</PrimaryButton>
    <p role="status">Primary action used {count} times.</p>
  {:else if kind === 'group'}
    <ButtonGroup
      label="Appearance example"
      onselect={(item) => (value = item.id)}
      items={[
        { id: 'light', label: 'Light', selected: value === 'light' },
        { id: 'dark', label: 'Dark', selected: value === 'dark' }
      ]}
    >
      {#snippet icon(item)}{#if item.id === 'light'}<Sun size={18} />{:else}<Moon
            size={18}
          />{/if}{/snippet}
    </ButtonGroup>
    <p role="status">Selected: {value}. Use Tab to focus a button, then Space to select it.</p>
  {:else}
    <div class="popup-anchor">
      <IconButton
        label="Example settings"
        bind:element={anchor}
        active={open}
        aria-expanded={open}
        aria-controls="example-settings"
        onclick={() => (open = !open)}><Settings size={20} /></IconButton
      >
      <Popup id="example-settings" title="Settings" bind:open {anchor}>
        <h3>Appearance</h3>
        <ButtonGroup
          label="Example appearance"
          onselect={(item) => (value = item.id)}
          items={[
            { id: 'light', label: 'Light', selected: value === 'light' },
            { id: 'dark', label: 'Dark', selected: value === 'dark' }
          ]}
        />
      </Popup>
    </div>
    <p>Open Settings, then click outside or press Escape. The trigger follows the popup state.</p>
  {/if}
</div>

<style>
  .demo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-radius);
  }
  .popup-anchor {
    position: relative;
  }
  .popup-anchor :global(.ps-popup) {
    left: 0;
    right: auto;
  }
  p {
    margin: 0;
    color: var(--ps-body);
  }
  h3 {
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
  }
</style>
