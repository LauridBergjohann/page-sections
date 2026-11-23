import { redirect } from '@sveltejs/kit';
import { base } from '#lib/paths.js';
export function load() {
  redirect(308, base + '/sections/code/');
}
