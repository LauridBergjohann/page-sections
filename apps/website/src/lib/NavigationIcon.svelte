<script lang="ts">
  import Layers from '@lucide/svelte/icons/layers';
  import Rocket from '@lucide/svelte/icons/rocket';
  import LayoutTemplate from '@lucide/svelte/icons/layout-template';
  import BookText from '@lucide/svelte/icons/book-text';
  import Info from '@lucide/svelte/icons/info';
  import Panels from '@lucide/svelte/icons/panels-top-left';
  import Blocks from '@lucide/svelte/icons/blocks';
  import Settings from '@lucide/svelte/icons/settings';
  import Book from '@lucide/svelte/icons/book-open';
  import Briefcase from '@lucide/svelte/icons/briefcase';
  import File from '@lucide/svelte/icons/file-text';
  import Palette from '@lucide/svelte/icons/palette';
  import Code from '@lucide/svelte/icons/code';
  import Download from '@lucide/svelte/icons/download';
  import Grid from '@lucide/svelte/icons/layout-grid';
  import Carousel from '@lucide/svelte/icons/gallery-horizontal-end';
  import Heading from '@lucide/svelte/icons/heading';
  import Hero from '@lucide/svelte/icons/panels-top-left';
  import Image from '@lucide/svelte/icons/image';
  import Panel from '@lucide/svelte/icons/panel-top';
  import Text from '@lucide/svelte/icons/text';
  import Video from '@lucide/svelte/icons/video';
  let { name }: { name?: string } = $props();
  const icons = {
    rocket: Rocket,
    'layout-template': LayoutTemplate,
    'book-text': BookText,
    info: Info,
    'panels-top-left': Panels,
    grid: Grid,
    carousel: Carousel,
    heading: Heading,
    hero: Hero,
    image: Image,
    panel: Panel,
    text: Text,
    video: Video,
    layers: Layers,
    panels: Panels,
    blocks: Blocks,
    settings: Settings,
    book: Book,
    briefcase: Briefcase,
    file: File,
    palette: Palette,
    code: Code,
    download: Download
  };
  const Icon = $derived(icons[name as keyof typeof icons] ?? File);
</script>

<Icon size={20} aria-hidden="true" />
