import type { Component } from 'svelte';
import type { SectionData } from '@page-sections/core';
import Sections from './Sections.svelte';
type $$ComponentProps = {
    sections: SectionData[];
    renderers?: Record<string, Component<any>>;
};
declare const Sections: Component<$$ComponentProps, {}, "">;
type Sections = ReturnType<typeof Sections>;
export default Sections;
