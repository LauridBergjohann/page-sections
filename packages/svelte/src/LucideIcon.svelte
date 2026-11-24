<!-- Lucide icon geometry, ISC/MIT licensed; see ../NOTICE. No runtime icon dependency. -->
<script lang="ts">
  let { name, size = 20 }: { name: string; size?: number } = $props();
  const icons: Record<string, [string, Record<string, string>][]> = {
  "x": [
    [
      "path",
      {
        "d": "M18 6 6 18"
      }
    ],
    [
      "path",
      {
        "d": "m6 6 12 12"
      }
    ]
  ],
  "check": [
    [
      "path",
      {
        "d": "M20 6 9 17l-5-5"
      }
    ]
  ],
  "plus": [
    [
      "path",
      {
        "d": "M5 12h14"
      }
    ],
    [
      "path",
      {
        "d": "M12 5v14"
      }
    ]
  ],
  "graduation-cap": [
    [
      "path",
      {
        "d": "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
      }
    ],
    [
      "path",
      {
        "d": "M22 10v6"
      }
    ],
    [
      "path",
      {
        "d": "M6 12.5V16a6 3 0 0 0 12 0v-3.5"
      }
    ]
  ],
  "briefcase": [
    [
      "path",
      {
        "d": "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
      }
    ],
    [
      "rect",
      {
        "width": "20",
        "height": "14",
        "x": "2",
        "y": "6",
        "rx": "2"
      }
    ]
  ],
  "bike": [
    [
      "circle",
      {
        "cx": "18.5",
        "cy": "17.5",
        "r": "3.5"
      }
    ],
    [
      "circle",
      {
        "cx": "5.5",
        "cy": "17.5",
        "r": "3.5"
      }
    ],
    [
      "circle",
      {
        "cx": "15",
        "cy": "5",
        "r": "1"
      }
    ],
    [
      "path",
      {
        "d": "M12 17.5V14l-3-3 4-3 2 3h2"
      }
    ]
  ],
  "award": [
    [
      "path",
      {
        "d": "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
      }
    ],
    [
      "circle",
      {
        "cx": "12",
        "cy": "8",
        "r": "6"
      }
    ]
  ],
  "book-open": [
    [
      "path",
      {
        "d": "M12 5v16"
      }
    ],
    [
      "path",
      {
        "d": "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"
      }
    ]
  ],
  "code": [
    [
      "path",
      {
        "d": "m16 18 6-6-6-6"
      }
    ],
    [
      "path",
      {
        "d": "m8 6-6 6 6 6"
      }
    ]
  ],
  "layers": [
    [
      "path",
      {
        "d": "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
      }
    ],
    [
      "path",
      {
        "d": "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
      }
    ],
    [
      "path",
      {
        "d": "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
      }
    ]
  ],
  "heart": [
    [
      "path",
      {
        "d": "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
      }
    ]
  ],
  "sprout": [
    [
      "path",
      {
        "d": "M14 9.536V7a4 4 0 0 1 4-4h1.5a.5.5 0 0 1 .5.5V5a4 4 0 0 1-4 4 4 4 0 0 0-4 4c0 2 1 3 1 5a5 5 0 0 1-1 3"
      }
    ],
    [
      "path",
      {
        "d": "M4 9a5 5 0 0 1 8 4 5 5 0 0 1-8-4"
      }
    ],
    [
      "path",
      {
        "d": "M5 21h14"
      }
    ]
  ],
  "palette": [
    [
      "path",
      {
        "d": "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"
      }
    ],
    [
      "circle",
      {
        "cx": "13.5",
        "cy": "6.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "17.5",
        "cy": "10.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "6.5",
        "cy": "12.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "8.5",
        "cy": "7.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ]
  ],
  "rocket": [
    [
      "path",
      {
        "d": "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
      }
    ],
    [
      "path",
      {
        "d": "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"
      }
    ],
    [
      "path",
      {
        "d": "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z"
      }
    ],
    [
      "path",
      {
        "d": "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05"
      }
    ]
  ],
  "git-pull-request": [
    [
      "circle",
      {
        "cx": "18",
        "cy": "18",
        "r": "3"
      }
    ],
    [
      "circle",
      {
        "cx": "6",
        "cy": "6",
        "r": "3"
      }
    ],
    [
      "path",
      {
        "d": "M13 6h3a2 2 0 0 1 2 2v7"
      }
    ],
    [
      "line",
      {
        "x1": "6",
        "x2": "6",
        "y1": "9",
        "y2": "21"
      }
    ]
  ]
};
</script>

{#if icons[name]}
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    {#each icons[name] as [tag, attributes]}<svelte:element this={tag} {...attributes} />{/each}
  </svg>
{/if}
