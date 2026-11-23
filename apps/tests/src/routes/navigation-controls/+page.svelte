<script lang="ts">
  import {
    ButtonGroup,
    ContentPage,
    HeadingSection,
    Section,
    Breadcrumbs
  } from '@page-sections/svelte';
  let selected = $state('first');
  let longLabels = $state(false);
  let direction = $state<'ltr' | 'rtl'>('ltr');
  const choices = $derived([
    {
      id: 'first',
      label: longLabels ? 'The first, longer option' : 'First',
      selected: selected === 'first'
    },
    { id: 'middle', label: 'Middle option', selected: selected === 'middle' },
    { id: 'last', label: 'Last', selected: selected === 'last' }
  ]);
</script>

<ContentPage page={{ title: 'Navigation controls' }} showContentMenu>
  <HeadingSection section={{ id: 'heading', title: 'Navigation controls', headingLevel: 1 }} />
  <Section section={{ id: 'controls', title: 'Selections', headline: 'Selections' }}>
    <div dir={direction}>
      <ButtonGroup
        label="Choose an option"
        items={choices}
        onselect={(item) => (selected = item.id)}
      />
    </div>
    <label><input type="checkbox" bind:checked={longLabels} /> Longer labels</label>
    <label>
      Direction<select bind:value={direction}><option>ltr</option><option>rtl</option></select>
    </label>
    <ButtonGroup
      label="Native links"
      items={[
        { id: 'current', label: 'Current', selected: true, href: '/navigation-controls/' },
        { id: 'disabled', label: 'Unavailable', href: '/', disabled: true },
        { id: 'next', label: 'Components', href: '/components/' }
      ]}
    />
    <Breadcrumbs
      items={[
        { label: 'A long documentation ancestor', href: '/' },
        { label: 'A long intermediate chapter', href: '/components/' },
        { label: 'A long current page title that must fit on a single line' }
      ]}
    />
  </Section>
</ContentPage>
