<figure aria-label="Background color and width explained">
  <div class="surfaces">
    <div>
      <div class="canvas"><div class="paint contained">Content</div></div>
      <strong>Standard size</strong>
      <p>Paint stays inside the content column.</p>
    </div>
    <div>
      <div class="canvas"><div class="paint full"><span>Content</span></div></div>
      <strong>Full size</strong>
      <p>Paint reaches the viewport edges. Content keeps its width.</p>
    </div>
    <div>
      <div class="canvas"><div class="paint gradient"><span>Content</span></div></div>
      <strong>Full + gradient</strong>
      <p>The surface transitions from its start color to its end color.</p>
    </div>
  </div>
  <div class="swatches">
    <span class="transparent">transparent</span><span class="standard">standard</span><span
      class="muted"
    >
      muted
    </span><span class="transition">transparentToStandard ↓</span>
  </div>
  <figcaption>
    Transparent reveals the page background. Standard and muted use theme colors; gradients blend
    those surfaces from top to bottom. Try the real sections below in either light or dark mode.
  </figcaption>
</figure>

<style>
  figure {
    margin: 0;
  }
  .surfaces {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
    gap: 20px;
  }
  .canvas {
    border: 1px solid var(--ps-border);
    padding-block: 18px;
    margin-bottom: 12px;
    background: repeating-linear-gradient(
      45deg,
      var(--ps-section-muted) 0 8px,
      var(--ps-background) 8px 16px
    );
  }
  .paint {
    min-height: 90px;
    display: grid;
    place-items: center;
    color: var(--ps-ink);
    background: var(--ps-section-standard);
  }
  .contained {
    margin-inline: 20%;
    border: 1px solid var(--ps-border);
    border-radius: 6px;
  }
  .paint span {
    border-inline: 1px dashed var(--ps-accent);
    width: 60%;
    text-align: center;
    padding-block: 25px;
  }
  .gradient {
    background: linear-gradient(to bottom, transparent, var(--ps-section-standard));
  }
  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 10px;
    margin-block: 20px;
    padding: 12px;
    border-radius: 8px;
    background: repeating-linear-gradient(
      45deg,
      var(--ps-section-muted) 0 8px,
      var(--ps-background) 8px 16px
    );
  }
  .swatches span {
    padding: 24px 12px;
    border: 1px solid var(--ps-border);
    border-radius: 6px;
    text-align: center;
    font-size: 13px;
    overflow-wrap: anywhere;
  }
  .standard {
    background: var(--ps-section-standard);
  }
  .muted {
    background: var(--ps-section-muted);
  }
  .transition {
    background: linear-gradient(to bottom, transparent, var(--ps-section-standard));
  }
  p,
  figcaption {
    color: var(--ps-body);
    line-height: 1.7;
  }
  p {
    margin-bottom: 0;
  }
</style>
