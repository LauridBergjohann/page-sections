import { readFileSync, writeFileSync } from 'node:fs';
import { renderPage } from './dist/server/entry-server.js';
const { body, head } = renderPage();
writeFileSync('dist/index.html', readFileSync('dist/index.html', 'utf8').replace('<!--app-->', body).replace('<!--head-->', head));
