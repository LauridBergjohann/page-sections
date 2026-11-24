import type { TimelineSectionData } from '@page-sections/core';

/** Fictional sample, not the author's biography. */
export const timelineExample: TimelineSectionData = {
  type: 'timeline',
  id: 'journey',
  title: 'My Journey',
  headline: 'My Journey',
  background: { color: 'standard' },
  introduction: 'A fictional journey through education, work and personal pursuits.',
  start: '2014',
  end: '2026',
  referenceDate: '2026-01-01',
  categories: [
    {
      id: 'education',
      title: 'Education',
      color: '#169b63',
      icon: 'graduation-cap',
      events: [
        {
          id: 'bachelor',
          icon: 'graduation-cap',
          type: 'period',
          title: 'B.Sc. Computer Science',
          start: '2014',
          end: '2018',
          description: 'Studied software systems at the fictional Northbridge Institute.',
          image: {
            src: '/timeline-campus.svg',
            srcDark: '/timeline-campus-dark.svg',
            alt: 'Illustration of the Northbridge campus',
            width: 640,
            height: 360,
            aspect: '16/9'
          }
        },
        {
          id: 'master',
          icon: 'book-open',
          type: 'period',
          title: 'M.Sc. Computer Science',
          start: '2019',
          end: '2021',
          description: { body: 'Research into **accessible interfaces** and distributed systems.' }
        },
        {
          id: 'cloud',
          icon: 'award',
          type: 'point',
          title: 'Cloud Certification',
          date: '2022-03',
          tags: ['Cloud', 'Learning'],
          action: {
            label: 'View certificate',
            href: 'https://example.com/certificate',
            variant: 'secondary'
          }
        },
        {
          id: 'systems',
          icon: 'award',
          type: 'point',
          title: 'Systems Certification',
          date: '2024-04-12'
        }
      ]
    },
    {
      id: 'work',
      title: 'Work',
      color: '#168d91',
      icon: 'briefcase',
      events: [
        {
          id: 'student',
          icon: 'briefcase',
          type: 'period',
          title: 'Working Student',
          start: '2016',
          end: '2018'
        },
        {
          id: 'engineer',
          icon: 'code',
          type: 'period',
          title: 'Software Engineer',
          start: '2018',
          end: '2021',
          description: 'Built collaborative tools with the team at the fictional Cedar Labs.'
        },
        {
          id: 'owner',
          icon: 'layers',
          type: 'period',
          title: 'Platform Owner',
          start: '2021',
          end: '2023'
        },
        {
          id: 'architect',
          icon: 'layers',
          type: 'period',
          title: 'Software Architect',
          start: '2022',
          description:
            'Design and evolve the platform architecture, set technical direction, and coach the engineering team.',
          tags: ['Architecture', 'Leadership', 'Platform'],
          action: { label: 'View project', href: '#journey', variant: 'primary' }
        },
        {
          id: 'platform',
          icon: 'layers',
          type: 'period',
          title: 'Digital Platform Architect',
          start: '2023-06',
          description: 'Connect product teams through a shared technical foundation.'
        },
        {
          id: 'opensource',
          icon: 'git-pull-request',
          type: 'period',
          title: 'Open Source Development',
          start: '2024',
          end: '2025',
          description: 'Maintaining accessible building blocks for community projects.',
          tags: ['Open source']
        }
      ]
    },
    {
      id: 'hobby',
      title: 'Hobby',
      color: '#69a52d',
      icon: 'bike',
      events: [
        {
          id: 'cycling',
          icon: 'bike',
          type: 'period',
          title: 'Cycling',
          start: '2015',
          description: 'Weekend rides and journeys along the coast.'
        },
        { id: 'marriage', icon: 'heart', type: 'point', title: 'Marriage', date: '2019-08' },
        {
          id: 'garden',
          icon: 'sprout',
          type: 'period',
          title: 'Community Garden',
          start: '2020',
          end: '2023'
        },
        {
          id: 'creative',
          icon: 'palette',
          type: 'period',
          title: 'Creative Side Projects',
          image: {
            src: '/timeline-creative.svg',
            alt: 'Interface sketch with an illustration, text and two project tiles',
            width: 640,
            height: 360,
            aspect: '16/9'
          },
          start: '2022',
          description: 'Small experiments in illustration and interaction design.'
        }
      ]
    }
  ]
};

export function timelineExampleFor(base: string, id = 'journey'): TimelineSectionData {
  return {
    ...timelineExample,
    id,
    categories: timelineExample.categories.map((category) => ({
      ...category,
      events: category.events.map((event) => ({
        ...event,
        image: event.image
          ? {
              ...event.image,
              src: base + event.image.src,
              srcDark: event.image.srcDark ? base + event.image.srcDark : undefined
            }
          : undefined,
        action:
          event.action?.href === '#journey' ? { ...event.action, href: '#' + id } : event.action
      }))
    }))
  };
}
