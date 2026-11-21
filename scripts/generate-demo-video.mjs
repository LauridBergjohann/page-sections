// Original silent animation for the native VideoSection examples. Requires local Chrome.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch({
  channel: 'chrome',
  headless: true,
  args: ['--disable-gpu']
});
try {
  const page = await browser.newPage();
  const data = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    document.body.append(canvas);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e7ebe9';
    ctx.fillRect(0, 0, 800, 450);
    const stream = canvas.captureStream(0);
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8',
      videoBitsPerSecond: 600000
    });
    const chunks = [];
    const result = new Promise((resolve) => {
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = async () => {
        const bytes = new Uint8Array(await new Blob(chunks).arrayBuffer());
        resolve(btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')));
      };
    });
    const rectangle = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 12);
      ctx.fill();
    };
    recorder.start(250);
    const start = performance.now();
    function draw(now) {
      const elapsed = now - start;
      ctx.fillStyle = '#e7ebe9';
      ctx.fillRect(0, 0, 800, 450);
      rectangle(40, 32, 720, 386, '#fffdf7');
      rectangle(64, 56, 672, 42, '#d9e8df');
      ctx.fillStyle = '#174d42';
      ctx.font = '600 24px sans-serif';
      ctx.fillText('Room for your ideas', 88, 85);
      for (let index = 0; index < 3; index++) {
        const progress = Math.max(0, Math.min(1, (elapsed - index * 450) / 800));
        const y = 124 + (1 - progress) * 50;
        ctx.globalAlpha = progress;
        rectangle(64 + index * 228, y, 216, 196, ['#afd6be', '#f1d7a9', '#bdd9df'][index]);
        rectangle(80 + index * 228, y + 120, 130, 10, '#326e5a');
        rectangle(80 + index * 228, y + 144, 176, 7, '#72998c');
        rectangle(80 + index * 228, y + 162, 148, 7, '#72998c');
        ctx.globalAlpha = 1;
      }
      rectangle(64, 350, 672, 42, '#174d42');
      ctx.fillStyle = '#fffdf7';
      ctx.font = '18px sans-serif';
      ctx.fillText('Build a page. Section by section.', 88, 378);
      stream.getVideoTracks()[0].requestFrame();
      if (elapsed < 4000) setTimeout(() => draw(performance.now()), 1000 / 24);
      else
        setTimeout(() => {
          recorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }, 250);
    }
    draw(performance.now());
    return result;
  });
  const directory = new URL('../apps/website/static/media/', import.meta.url);
  await mkdir(directory, { recursive: true });
  const video = Buffer.from(data, 'base64');
  if (video.length < 1000) throw new Error('Video recording did not contain frames.');
  await writeFile(new URL('sections-demo.webm', directory), video);
  await writeFile(
    new URL('sections-demo.vtt', directory),
    'WEBVTT\n\n00:00.000 --> 00:02.200\nThree illustrated cards appear beneath a page heading.\n\n00:02.200 --> 00:04.100\nBuild a page. Section by section.\n'
  );
  console.log('Created original four-second video and English descriptions.');
} finally {
  await browser.close();
}
