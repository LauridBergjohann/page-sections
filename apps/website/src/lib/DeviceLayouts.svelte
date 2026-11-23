<script lang="ts">
  import { layoutTokens } from '@page-sections/core';
  const devices = [
    { key: 'xs', name: 'Phone', w: 34, h: 60 },
    { key: 's', name: 'Small tablet', w: 52, h: 64 },
    { key: 'm', name: 'Tablet', w: 76, h: 54 },
    { key: 'l', name: 'Small laptop', w: 90, h: 54 },
    { key: 'xl', name: 'Laptop', w: 102, h: 60 },
    { key: '2xl', name: 'Desktop', w: 120, h: 56 },
    { key: '3xl', name: 'Wide desktop', w: 144, h: 48 }
  ] as const;
</script>

<figure aria-label="Seven viewport sizes from phone to wide desktop">
  <div class="devices">
    {#each devices as device, index}
      <div class="device">
        <svg viewBox="0 0 160 96" aria-hidden="true">
          <rect
            x={(160 - device.w) / 2}
            y={8 + (64 - device.h) / 2}
            width={device.w}
            height={device.h}
            rx="4"
            fill="var(--ps-section-muted)"
            stroke="currentColor"
            stroke-width="2"
          />
          <rect
            x={(160 - device.w) / 2 + 5}
            y={14 + (64 - device.h) / 2}
            width={device.w - 10}
            height="6"
            rx="1"
            fill="var(--ps-accent)"
          />
          <rect
            x={index > 3 ? 59 : (160 - device.w) / 2 + 5}
            y={25 + (64 - device.h) / 2}
            width={index > 3 ? 42 : device.w - 10}
            height={device.h - 23}
            rx="1"
            fill="var(--ps-accent)"
            opacity=".18"
          />
          {#if index >= 5}<path
              d="M80 73v8m-18 0h36"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />{:else if index === 3 || index === 4}<path
              d={`M${(160 - device.w) / 2 - 4} ${8 + (64 + device.h) / 2}h${device.w + 8}l6 5H${(160 - device.w) / 2 - 10}z`}
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />{/if}
        </svg>
        <strong>{device.key.toUpperCase()}</strong>
        <span>{device.name}</span>
        <small
          >{index === 0
            ? 'Below 600'
            : index === devices.length - 1
              ? `${layoutTokens.layoutMinWidths[device.key]}+`
              : `${layoutTokens.layoutMinWidths[device.key]}–${layoutTokens.layoutMinWidths[devices[index + 1].key] - 1}`}
          CSS px</small
        >
      </div>
    {/each}
  </div>
  <figcaption>
    Device drawings are orientation aids, not device detection. Window size, split-screen use and
    zoom determine the available CSS viewport. A large monitor can still have a small browser
    window.
  </figcaption>
</figure>

<style>
  figure {
    margin: 0;
  }
  .devices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(145px, 1fr));
    gap: 12px;
  }
  .device {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 6px;
    padding: 14px 10px;
    border: 1px solid var(--ps-border);
    border-radius: 12px;
    color: var(--ps-ink);
  }
  svg {
    width: 100%;
    max-width: 180px;
    height: 100px;
  }
  strong {
    color: var(--ps-accent);
    font-size: 1.25rem;
  }
  small,
  figcaption {
    color: var(--ps-body);
  }
  figcaption {
    margin-top: 16px;
    line-height: 1.7;
  }
</style>
