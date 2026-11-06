import { type Snippet } from 'svelte';
import type { SectionDefinition, CardItem, CardSize } from '@page-sections/core';
declare function $$render<T extends CardItem>(): {
    props: {
        section: SectionDefinition;
        list: T[];
        cardSize?: CardSize;
        controls?: boolean;
        previousLabel?: string;
        nextLabel?: string;
        itemContent?: Snippet<[T]>;
        media?: Snippet<[T]>;
    };
    exports: {};
    bindings: "";
    slots: {};
    events: {};
};
declare class __sveltets_Render<T extends CardItem> {
    props(): ReturnType<typeof $$render<T>>['props'];
    events(): ReturnType<typeof $$render<T>>['events'];
    slots(): ReturnType<typeof $$render<T>>['slots'];
    bindings(): "";
    exports(): {};
}
interface $$IsomorphicComponent {
    new <T extends CardItem>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<T>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<T>['props']>, ReturnType<__sveltets_Render<T>['events']>, ReturnType<__sveltets_Render<T>['slots']>> & {
        $$bindings?: ReturnType<__sveltets_Render<T>['bindings']>;
    } & ReturnType<__sveltets_Render<T>['exports']>;
    <T extends CardItem>(internal: unknown, props: ReturnType<__sveltets_Render<T>['props']> & {}): ReturnType<__sveltets_Render<T>['exports']>;
    z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const CarouselSection: $$IsomorphicComponent;
type CarouselSection<T extends CardItem> = InstanceType<typeof CarouselSection<T>>;
export default CarouselSection;
