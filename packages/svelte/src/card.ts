import type { CardItem } from '@page-sections/core';
/** Stable DOM parts for optional measurement/interaction adapters. Return a cleanup function. */
export interface CardElements<T extends CardItem = CardItem> {
  item: T;
  root: HTMLElement;
  surface: HTMLElement;
  media: HTMLElement;
  copy: HTMLElement;
  title: HTMLElement;
}
