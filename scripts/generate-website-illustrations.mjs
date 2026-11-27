// Original vector illustrations for the section catalog, Getting Started and homepage.
import { mkdirSync, writeFileSync } from 'node:fs';
import { format } from 'prettier';
const output = new URL('../apps/website/static/illustrations/', import.meta.url);
mkdirSync(output, { recursive: true });
const rect = (x, y, w, h, fill = '#e4eeea', r = 10) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
const line = (x, y, w, c = '#b1c9c0', h = 8) => rect(x, y, w, h, c, 4);
const lines = (x, y, w, n = 3) =>
  Array.from({ length: n }, (_, i) => line(x, y + i * 22, w - (i === n - 1 ? 55 : 0))).join('');
const landscape = (x, y, w, h) =>
  `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice"><rect width="320" height="180" fill="#bddbd1"/><circle cx="250" cy="40" r="23" fill="#f9d790"/><path d="M0 150 100 40 200 155 260 80 320 140V180H0" fill="#8bb7a4"/><path d="M0 170 95 112 180 180 300 95 320 150V180H0" fill="#347e66"/></svg>`;
const card = (x, y, w = 170, h = 125) =>
  rect(x, y, w, h, '#edf3ef') +
  landscape(x + 8, y + 8, w - 16, h * 0.54) +
  line(x + 12, y + h * 0.66, w - 35, '#347e66') +
  line(x + 12, y + h * 0.82, w - 55);
const text = (x, y, value, size = 24, color = '#185b48') =>
  `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" font-weight="700" fill="${color}">${value}</text>`;
const scenes = {
  features: { title: 'Centered feature icons with titles and descriptions', art: [0,1,2,3,4,5].map(i => { const x = 200 + i % 3 * 200, y = 170 + Math.floor(i / 3) * 170; return '<circle cx="'+x+'" cy="'+y+'" r="54" fill="#e4eeea"/><path d="M'+(x-26)+' '+y+'l26-20 26 20-26 20z" fill="none" stroke="#347e66" stroke-width="4"/>' + line(x-70,y+74,140,'#185b48') + line(x-60,y+96,120); }).join('') },
  timeline: {"title":"Horizontal projects and clustered releases on shared tracks","art":"<rect x=\"42\" y=\"58\" width=\"716\" height=\"384\" rx=\"22\" fill=\"#f2f8f5\" stroke=\"#bfd9ce\"/><g stroke=\"#bdd5cb\" stroke-dasharray=\"3 5\"><path d=\"M110 120v270m145-270v270m145-270v270m145-270v270m145-270v270\"/></g><path d=\"M72 390h656\" stroke=\"#588775\" stroke-width=\"2\"/><g fill=\"#89b5ce\" stroke=\"#2f6ea6\"><rect x=\"100\" y=\"326\" width=\"525\" height=\"32\" rx=\"16\"/><rect x=\"225\" y=\"274\" width=\"360\" height=\"32\" rx=\"16\"/></g><g fill=\"#a4c8b1\" stroke=\"#438468\"><rect x=\"150\" y=\"222\" width=\"265\" height=\"32\" rx=\"16\"/><rect x=\"458\" y=\"222\" width=\"240\" height=\"32\" rx=\"16\"/></g><g fill=\"#e6bd89\" stroke=\"#ad651e\"><circle cx=\"545\" cy=\"170\" r=\"22\"/><circle cx=\"320\" cy=\"170\" r=\"16\"/></g><g fill=\"#224d40\" font-family=\"sans-serif\" font-size=\"15\"><text x=\"128\" y=\"347\">Open access</text><text x=\"252\" y=\"295\">Shared stations</text><text x=\"174\" y=\"244\">Field research</text><text x=\"540\" y=\"176\" font-weight=\"bold\">7</text><text x=\"92\" y=\"418\">2026</text><text x=\"382\" y=\"418\">2022</text><text x=\"672\" y=\"418\">2018</text></g><g fill=\"#2f6ea6\"><circle cx=\"468\" cy=\"88\" r=\"6\"/></g><circle cx=\"575\" cy=\"88\" r=\"6\" fill=\"#438468\"/><circle cx=\"680\" cy=\"88\" r=\"6\" fill=\"#ad651e\"/>"},
  'feature-layout': {
    title: 'One responsive grid, from desktop to phone',
    art: rect(108, 115, 390, 245, '#e4eeea') + rect(124, 131, 358, 32, '#347e66') +
      [0, 1, 2].map(i => card(124 + i * 121, 181, 111, 157)).join('') +
      rect(536, 105, 146, 294, '#173d35', 22) + rect(546, 121, 126, 258, '#f1f6f3', 14) +
      rect(558, 141, 102, 25, '#347e66') + card(558, 180, 102, 100) + lines(558, 302, 96, 3) +
      line(229, 379, 148, '#347e66', 12)
  },
  'feature-sections': {
    title: 'A connected page made from different sections',
    art: rect(118, 109, 294, 116, '#d9ebe1') + text(138, 149, 'A place for ideas', 23) + lines(138, 172, 245, 2) +
      landscape(432, 109, 246, 116) + [0, 1, 2].map(i => card(118 + i * 192, 247, 176, 140)).join('') +
      line(118, 408, 560, '#347e66', 5)
  },
  'feature-content': {
    title: 'Structured content becomes a visual page',
    art: rect(108, 123, 238, 263, '#173d35') + text(130, 160, 'content.json', 20, '#a9d7c0') +
      text(130, 206, '{', 30, '#edcf8d') + lines(154, 225, 156, 4) + text(130, 347, '}', 30, '#edcf8d') +
      text(370, 263, '→', 42) + card(446, 123, 242, 263)
  },
  'feature-html': {
    title: 'Readable content is already part of the document',
    art: rect(166, 106, 344, 298, '#e4eeea') + text(194, 155, '&lt;main&gt;', 26) +
      text(194, 208, 'Content comes first.', 24) + lines(194, 236, 275, 4) + text(194, 367, '&lt;/main&gt;', 26) +
      `<circle cx="570" cy="270" r="73" fill="#347e66"/><path d="m535 269 24 24 47-51" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`
  },
  'feature-theme': {
    title: 'Light and dark designs share a color palette',
    art: rect(108, 113, 278, 220, '#e4eeea') + rect(414, 113, 278, 220, '#173d35') +
      text(132, 158, 'Light', 26) + text(438, 158, 'Dark', 26, '#a9d7c0') +
      lines(132, 187, 218, 3) + lines(438, 187, 218, 3) +
      ['#347e66', '#99cdb5', '#edcf8d', '#a7bfd6', '#173d35'].map((c, i) =>
        `<circle cx="${224 + i * 88}" cy="379" r="26" fill="${c}"/>`).join('')
  },
  'feature-independent': {
    title: 'One library connects to different application foundations',
    art: `<path d="M400 220V180H224V149M400 220V180H576V149M400 286V330H224V365M400 286V330H576V365" fill="none" stroke="#94b8a9" stroke-width="8"/>` +
      rect(274, 211, 252, 86, '#347e66') + text(303, 262, 'Page Sections', 25, '#fff') +
      rect(140, 108, 168, 56) + text(180, 144, 'Svelte', 24) +
      rect(492, 108, 168, 56) + text(522, 144, 'SvelteKit', 24) +
      rect(140, 350, 168, 56) + text(182, 386, 'HTML', 24) +
      rect(492, 350, 168, 56) + text(527, 386, 'Your CMS', 21)
  },
  'explore-start': {
    title: 'An installation command and a live preview',
    art: rect(108, 117, 320, 272, '#173d35') + text(132, 160, 'Get started', 25, '#a9d7c0') +
      text(132, 218, '$ npm install', 22, '#edcf8d') + text(132, 253, '@page-sections', 22, '#a9d7c0') +
      text(132, 288, '/svelte', 22, '#a9d7c0') + line(132, 338, 160, '#a9d7c0') +
      card(452, 117, 234, 272) + `<circle cx="569" cy="209" r="34" fill="#fff"/><path d="m561 190 26 19-26 19Z" fill="#347e66"/>`
  },
  'explore-sections': {
    title: 'Browse a catalog of different section compositions',
    art: text(112, 133, 'Find your next building block', 27) +
      card(112, 158, 174, 110) + rect(312, 158, 174, 110, '#173d35') + lines(330, 180, 133, 3) +
      landscape(512, 158, 174, 110) + rect(112, 292, 174, 110) + lines(130, 315, 132, 3) +
      rect(312, 292, 174, 110, '#d9ebe1') + text(330, 332, 'Hello, world.', 20) + line(330, 352, 130) +
      card(512, 292, 174, 110)
  },
  'explore-theme': {
    title: 'Make a page your own with a coordinated palette',
    art: rect(108, 109, 430, 290, '#e4eeea') + landscape(124, 125, 398, 132) +
      text(132, 300, 'Your ideas. Your identity.', 26) + lines(132, 326, 350, 2) +
      ['#347e66', '#99cdb5', '#edcf8d', '#a7bfd6'].map((c, i) =>
        `<circle cx="620" cy="${135 + i * 79}" r="31" fill="${c}"/>`).join('')
  },
  'card-grid': {
    title: 'A responsive grid of six cards',
    art: [0, 1, 2]
      .map((i) => card(110 + i * 200, 112, 180, 132) + card(110 + i * 200, 270, 180, 132))
      .join('')
  },
  carousel: {
    title: 'A scrollable row of image cards',
    art:
      card(110, 132, 230, 228) +
      card(364, 132, 230, 228) +
      card(618, 132, 82, 228) +
      line(110, 390, 484) +
      rect(110, 390, 180, 8, '#27795e', 4) +
      text(666, 400, '→', 30)
  },
  code: {
    title: 'A code editor with highlighted source',
    art:
      rect(104, 108, 592, 292, '#173d35') +
      text(130, 147, 'example.svelte', 16, '#8bc3aa') +
      Array.from(
        { length: 8 },
        (_, i) =>
          text(126, 181 + i * 25, String(i + 1), 12, '#6f9b8b') +
          line(
            158 + (i % 3) * 18,
            170 + i * 25,
            170 + (i % 4) * 54,
            ['#a8d9b7', '#edcf8d', '#a7bfd6'][i % 3]
          )
      ).join('')
  },
  headings: {
    title: 'Eyebrow, headline and introduction',
    art:
      text(112, 148, 'A NEW PERSPECTIVE', 14) +
      text(112, 222, 'Room for ideas.', 52) +
      lines(114, 257, 460, 2) +
      rect(112, 336, 574, 3, '#d9e8e0') +
      text(112, 380, 'A smaller chapter heading', 27)
  },
  hero: {
    title: 'A large image with an inviting headline and action',
    art:
      landscape(92, 100, 616, 308) +
      rect(116, 144, 360, 224, '#fffffff0') +
      text(138, 185, 'SMALL BEGINNINGS', 13) +
      text(138, 231, 'Grow together.', 36) +
      lines(138, 255, 264, 2) +
      rect(138, 315, 145, 32, '#007b5e', 16) +
      text(158, 337, 'Explore →', 15, '#fff')
  },
  image: {
    title: 'A landscape image beside descriptive text',
    art:
      landscape(106, 126, 310, 246) +
      text(446, 167, 'The bigger picture', 20) +
      lines(446, 197, 215, 5) +
      line(446, 335, 145, '#007b5e')
  },
  panel: {
    title: 'Related information grouped on a tinted panel',
    art:
      rect(114, 116, 572, 278, '#e1eee5') +
      rect(114, 116, 6, 278, '#007b5e', 2) +
      text(146, 167, 'A little extra context', 29) +
      lines(146, 200, 492, 4) +
      rect(146, 326, 156, 38, '#007b5e', 19) +
      text(165, 351, 'Learn more →', 16, '#fff')
  },
  'rich-text': {
    title: 'An editorial page with headings, paragraphs and a quote',
    art:
      text(122, 147, 'Stories worth sharing', 30) +
      lines(122, 180, 530, 3) +
      rect(122, 256, 4, 62, '#007b5e', 2) +
      text(144, 282, '“Make space for a new idea.”', 24) +
      line(144, 301, 320) +
      [346, 374, 402]
        .map((y) => `<circle cx="127" cy="${y}" r="4" fill="#007b5e"/>` + line(146, y - 4, 390))
        .join('')
  },
  video: {
    title: 'A video player with playback controls',
    art:
      landscape(102, 106, 596, 292) +
      `<circle cx="400" cy="247" r="43" fill="#ffffffed"/><path d="m391 224 32 23-32 23Z" fill="#007b5e"/>` +
      rect(102, 361, 596, 37, '#173d35', 0) +
      line(146, 377, 492, '#83bba2', 5) +
      line(146, 377, 185, '#fff', 5)
  },
  'add-sections': {
    title: 'Different sections combine into a page',
    art:
      rect(120, 110, 258, 128, '#d9ebe1') +
      text(144, 157, 'Hello, world.', 29) +
      line(144, 181, 180) +
      card(406, 110, 266, 128) +
      card(120, 262, 166, 130) +
      rect(310, 262, 362, 130, '#e5dfef') +
      lines(336, 290, 282, 4)
  },
  'page-layout': {
    title: 'Header, content grid, sidebars and footer',
    art:
      rect(106, 112, 588, 42, '#007b5e') +
      rect(106, 174, 104, 164) +
      rect(230, 174, 340, 164, '#cee4d9') +
      rect(590, 174, 104, 164) +
      rect(106, 358, 588, 40, '#669c87') +
      lines(122, 192, 74, 5) +
      lines(250, 194, 290, 5) +
      lines(604, 192, 74, 5)
  },
  'adapt-theme': {
    title: 'A palette connects light and dark surfaces',
    art:
      rect(108, 108, 282, 245, '#edf3ef') +
      rect(410, 108, 282, 245, '#193f35') +
      lines(132, 140, 230, 3) +
      lines(434, 140, 230, 3) +
      rect(132, 243, 138, 36, '#007b5e', 18) +
      rect(434, 243, 138, 36, '#7ecfa7', 18) +
      ['#007b5e', '#7ecfa7', '#edca80', '#a8bdd0', '#193f35']
        .map((c, i) => `<circle cx="${240 + i * 80}" cy="389" r="24" fill="${c}"/>`)
        .join('')
  },
  'minimal-demo': {
    title: 'A minimal application with source and a preview',
    art:
      rect(108, 110, 272, 284, '#193f35') +
      text(128, 146, 'App.svelte', 17, '#a9d7c0') +
      Array.from({ length: 7 }, (_, i) =>
        line(130 + (i % 2) * 16, 172 + i * 26, 170 + (i % 3) * 20, '#9ecbb4')
      ).join('') +
      rect(404, 110, 288, 284, '#edf3ef') +
      landscape(418, 124, 260, 120) +
      text(422, 282, 'Field notes', 25) +
      lines(422, 306, 230, 3)
  }
};
// Homepage and Getting Started use brand-green accents and restrained companion colors.
const palettes = {
  'feature-layout': ['#007b5e', '#839bad', '#edf2f4', '#e6d7b9'],
  'feature-sections': ['#347e66', '#a79cae', '#f0edf3', '#ddd2bf'],
  'feature-content': ['#007b5e', '#b1a187', '#f3f0e9', '#c8d8de'],
  'feature-html': ['#007b5e', '#92a6b3', '#edf2f4', '#e1d5b9'],
  'feature-theme': ['#007b5e', '#91aa9f', '#edf2ef', '#d8cbb9'],
  'feature-independent': ['#347e66', '#8b9faf', '#edf0f4', '#ddcfb6'],
  'explore-start': ['#007b5e', '#91a5b3', '#edf1f4', '#e4d4b6'],
  'explore-sections': ['#347e66', '#b4a18f', '#f3eee9', '#c9d8dc'],
  'explore-theme': ['#007b5e', '#a89ab2', '#f0edf3', '#dfd2b8'],
  'add-sections': ['#007b5e', '#91a5b3', '#edf1f4', '#e3d3bc'],
  'page-layout': ['#347e66', '#8b9faf', '#eef2f3', '#ded0b9'],
  'adapt-theme': ['#007b5e', '#a89ab2', '#f0edf3', '#dfd2b8'],
  'minimal-demo': ['#007b5e', '#9baa9b', '#eef2ef', '#ded0bc']
};
function recolor(art, [accent, secondary, tint, warm]) {
  const colors = {
    '#91b4a5': '#17243c26', '#f1f6f3': '#f1f4f3', '#94b8a9': '#a9b8b2',
    '#185b48': '#273c34', '#173d35': '#26332f', '#193f35': '#26332f',
    '#e4eeea': '#eef0f5', '#edf3ef': '#f2f3f7', '#b1c9c0': '#b7c1d0',
    '#347e66': accent, '#007b5e': accent, '#27795e': accent, '#669c87': secondary,
    '#bddbd1': tint, '#8bb7a4': secondary, '#f9d790': warm,
    '#d9ebe1': tint, '#cee4d9': tint, '#e1eee5': tint, '#d9e8e0': '#dde2ea',
    '#e5dfef': warm, '#a9d7c0': '#b8dacb', '#9ecbb4': '#a8c7ba',
    '#8bc3aa': '#a8c7ba', '#6f9b8b': '#83998f', '#a8d9b7': '#b4d8c7',
    '#edcf8d': '#d8c6a5', '#a7bfd6': '#b9c8d7', '#83bba2': '#b3cec1',
    '#7ecfa7': '#2bc093', '#edca80': '#d8bf97', '#a8bdd0': '#a8bbc8',
    '#99cdb5': secondary
  };
  return art.replace(/#[\da-f]{8}\b|#[\da-f]{6}\b/gi, color => colors[color.toLowerCase()] ?? color);
}
// Tight visible-art bounds, including text and the timeline outline. Nested landscape
// viewports are already clipped; their offscreen geometry is not part of these bounds.
const artBounds = {
  features: [130, 116, 540, 328],
  'timeline': [41.5, 57.5, 717, 385],
  'feature-layout': [108, 105, 574, 294],
  'feature-sections': [118, 109, 560, 304],
  'feature-content': [108, 123, 580, 263],
  'feature-html': [166, 106, 477, 298],
  'feature-theme': [108, 113, 584, 292],
  'feature-independent': [140, 108, 520, 298],
  'explore-start': [108, 117, 578, 272],
  'explore-sections': [112, 109, 574, 293],
  'explore-theme': [108, 104, 543, 299],
  'card-grid': [110, 112, 580, 290],
  'carousel': [110, 132, 590, 274],
  'code': [104, 108, 592, 292],
  'headings': [111, 135, 575, 251],
  'hero': [92, 100, 616, 308],
  'image': [106, 126, 555, 246],
  'panel': [114, 116, 572, 278],
  'rich-text': [122, 120, 530, 286],
  'video': [102, 106, 596, 292],
  'add-sections': [120, 110, 552, 282],
  'page-layout': [106, 112, 588, 286],
  'adapt-theme': [108, 108, 584, 305],
  'minimal-demo': [108, 110, 584, 284]
};
const sizes = {};
for (const [slug, { title, art }] of Object.entries(scenes)) {
  const [x, y, width, height] = artBounds[slug];
  const content = palettes[slug] ? recolor(art, palettes[slug]) : art;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="' + [x, y, width, height].join(' ') + '"><title>' + title + '</title>' + content + '</svg>\n';
  writeFileSync(new URL(slug + '.svg', output), svg);
  sizes[slug] = { width, height };
}
writeFileSync(new URL('../apps/website/src/lib/illustrationSizes.ts', import.meta.url), await format(
  '// Generated by scripts/generate-website-illustrations.mjs.\n' +
  'export const illustrationSizes: Record<string, { width: number; height: number }> = ' +
  JSON.stringify(sizes, null, 2) + ';\n', { parser: 'typescript', singleQuote: true, printWidth: 100, trailingComma: 'none' }));
console.log('Created ' + Object.keys(scenes).length + ' tightly cropped SVG illustrations.');
