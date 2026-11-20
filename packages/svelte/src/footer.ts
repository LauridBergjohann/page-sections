import type { Snippet } from 'svelte';
import type { FooterLink } from '@page-sections/core';

/** Icons are supplied by the host; the visible label names the link. */
export interface FooterSocialLink extends FooterLink { icon: Snippet }
