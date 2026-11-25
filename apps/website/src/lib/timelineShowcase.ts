import type { TimelineSectionData } from '@page-sections/core';

/** Canonical fictional showcase, supplied with the horizontal timeline brief. */
export const timelineShowcase: TimelineSectionData = {
  type: 'timeline',
  id: 'morgenhafen-timeline',
  title: 'Morgenhafen — an open urban lab',
  headline: 'From an open workshop to a shared urban lab.',
  introduction:
    'Morgenhafen is an entirely fictional urban lab. Its story brings together shared workshops, long-running projects, research and public releases. Explore how these activities develop alongside one another between 2004 and 2026. All names, events and outcomes are fictional.',
  layout: 'full',
  spacing: 'spacious',
  background: {
    color: 'standard',
    size: 'full'
  },
  locale: 'en-GB',
  presentLabel: 'Present',
  emptyLabel: 'Select at least one category to explore the story.',
  direction: 'descending',
  start: '2004',
  referenceDate: '2026-11-25',
  categories: [
    {
      id: 'programme',
      title: 'Programme & operations',
      icon: 'briefcase',
      color: '#2F6EA6',
      events: [
        {
          id: 'mh-programme-workshop',
          type: 'period',
          start: '2004',
          end: '2006',
          label: 'Open workshop',
          title: 'An open workshop in the old ferry house',
          description:
            'The first groups share tools, repair everyday objects and collect ideas for the neighbourhood. A weekly workshop evening gives the programme a shared starting point.',
          icon: 'heart',
          tags: ['Community', 'Repair']
        },
        {
          id: 'mh-programme-foundation',
          type: 'point',
          date: '2004-04-24',
          label: 'A shared beginning',
          title: 'Morgenhafen agrees its first shared principles',
          description:
            'An open agreement sets out access, tool use and documentation of shared work. It continues to evolve at the monthly meetings.',
          icon: 'book-open'
        },
        {
          id: 'mh-programme-hall-conversion',
          type: 'period',
          start: '2007-03',
          end: '2009-10',
          label: 'From warehouse to lab',
          title: 'Converting a warehouse into a shared urban lab',
          description:
            'The workshop gains space for electronics, woodworking and public meetings. Conversion takes place in stages while activities continue in the ferry house.',
          icon: 'layers'
        },
        {
          id: 'mh-programme-observatory',
          type: 'period',
          start: '2009-10',
          end: '2016-12',
          label: 'Open urban observatory',
          title: 'Establishing and running the first open urban observatory',
          description:
            'Shared walks, monitoring stations and maps make changes in the neighbourhood easier to understand. The observatory connects workshop activities with public discussion.',
          icon: 'briefcase'
        },
        {
          id: 'mh-programme-hall-opening',
          type: 'point',
          date: '2009-10-03',
          title: 'The harbour hall opens',
          description:
            'An open tour introduces the workshop, materials store and shared mapping room.',
          image: {
            src: '/timeline-campus.svg',
            srcDark: '/timeline-campus-dark.svg',
            alt: 'Stylised illustration of a shared building with a green outdoor space',
            width: 640,
            height: 360,
            aspect: '16/9'
          }
        },
        {
          id: 'mh-programme-neighbourhood-network',
          type: 'period',
          start: '2013',
          end: '2020',
          label: 'Neighbourhood workshops',
          title: 'A network of neighbourhood workshop spaces',
          description:
            'Smaller meeting places host repair evenings and simple monitoring activities. Shared equipment boxes support activities without a permanent workshop.',
          icon: 'heart'
        },
        {
          id: 'mh-programme-cooperative',
          type: 'period',
          start: '2017-01',
          end: '2023-12',
          label: 'Shared lab operations',
          title: 'Shared stewardship of spaces, tools and open data',
          description:
            'An elected group coordinates room use, maintenance and budgets. Participants document decisions and hand over responsibilities at regular open meetings.',
          icon: 'briefcase'
        },
        {
          id: 'mh-programme-regional-labs',
          type: 'period',
          start: '2020-04',
          end: '2024-11',
          label: 'Mobile labs across the region',
          title: 'Collaboration with mobile labs in the surrounding area',
          description:
            'Portable workstations take maps, monitoring equipment and repair sessions to smaller settlements. Lessons from these visits inform the shared equipment.',
          icon: 'bike'
        },
        {
          id: 'mh-programme-open-access',
          type: 'period',
          start: '2021-02',
          label: 'Accessible workshops and digital services for a city everyone can take part in',
          title:
            'Accessible workshops, events and digital services: a shared programme for orientation, access and independent use',
          description:
            'Groups review routes, signage, event materials and digital interfaces with their users. Improvements are incorporated into everyday operations.',
          icon: 'heart',
          tags: ['Accessibility', 'Participation']
        },
        {
          id: 'mh-programme-repair-network',
          type: 'period',
          start: '2024-01',
          label: 'Sharing maintenance',
          title: 'A lasting network for maintaining and repairing shared infrastructure',
          description:
            'Every shared station has documented stewardship and a stock of spare parts. Public maintenance sessions combine repairs with passing on knowledge.',
          icon: 'briefcase'
        },
        {
          id: 'mh-programme-open-lab-week',
          type: 'period',
          start: '2025-06-12',
          end: '2025-06-19',
          label: 'Open lab week',
          title: 'A week of open workshops and public experiments',
          description:
            'Workshop groups open their work in progress to visitors. Short experiments with shade, water and sound run in parallel at several locations.',
          icon: 'rocket'
        },
        {
          id: 'mh-programme-shared-charter',
          type: 'point',
          date: '2025-06-14',
          label: 'The new lab charter',
          title: 'A shared charter for care, access and reuse',
          description:
            'Participating spaces bring their experience together in a shared charter. New groups can join with their own responsibilities and available resources.',
          icon: 'check'
        }
      ]
    },
    {
      id: 'projects',
      title: 'Projects & prototypes',
      icon: 'layers',
      color: '#16835D',
      events: [
        {
          id: 'mh-projects-river-map',
          type: 'period',
          start: '2005',
          end: '2008',
          label: 'Routes by the water',
          title: 'A collaboratively drawn map of routes along the water',
          description:
            'Residents map everyday routes, obstacles and places to spend time. Paper maps and a simple digital archive together form the first urban atlas.',
          icon: 'palette'
        },
        {
          id: 'mh-projects-mobile-workbench',
          type: 'period',
          start: '2007-06',
          end: '2012-09',
          label: 'The travelling workbench',
          title: 'A mobile workbench for public spaces',
          description:
            'A converted trailer carries tools and work surfaces. The equipment is tested at repair sessions and adapted for use without a mains connection.',
          icon: 'bike'
        },
        {
          id: 'mh-projects-rainfall-network',
          type: 'period',
          start: '2011-02',
          end: '2019-03',
          label: 'Measuring rain together',
          title: 'An open network of simple rainfall stations',
          description:
            'Groups develop durable enclosures, regular inspection rounds and a shared data format. Several generations of stations remain in service for comparison.',
          icon: 'sprout'
        },
        {
          id: 'mh-projects-material-library',
          type: 'period',
          start: '2014-04',
          end: '2017-11',
          label: 'Reusing materials',
          title: 'A materials library for reusable components',
          description:
            'Leftover materials and retired components are measured, labelled and made available for new work. A simple catalogue connects storage locations with documented examples.',
          icon: 'layers'
        },
        {
          id: 'mh-projects-rain-gauge-prototype',
          type: 'point',
          date: '2014-05-17',
          title: 'First rain gauge with locally replaceable components',
          description:
            'A public test demonstrates how the collector, enclosure and counter can be maintained separately.',
          icon: 'rocket'
        },
        {
          id: 'mh-projects-sound-monitoring',
          type: 'period',
          start: '2016-03',
          end: '2020-07',
          label: 'Neighbourhood sound',
          title: 'Comparable sound measurements using simple sensors',
          description:
            'Portable kits and fixed stations capture different everyday situations. Documentation explains measurement limits and separates observations from personal assessments.',
          icon: 'code'
        },
        {
          id: 'mh-projects-neighbourhood-energy',
          type: 'period',
          start: '2017-06',
          end: '2024-12',
          label: 'Making energy visible',
          title: 'Shared energy displays for workshops and neighbourhood spaces',
          description:
            'Displays turn consumption data into understandable daily and weekly patterns. Several interface variants are tested over time in spaces with different uses.',
          icon: 'code'
        },
        {
          id: 'mh-projects-water-garden',
          type: 'period',
          start: '2019-01',
          end: '2022-12',
          label: 'The rainwater garden',
          title: 'A rainwater garden as a public experimental space',
          description:
            'Beds, collection tanks and simple level indicators make water flows visible. Care groups record seasonal changes and adjust the planting together.',
          icon: 'sprout'
        },
        {
          id: 'mh-projects-school-station-kit',
          type: 'period',
          start: '2019-01',
          end: '2022-12',
          label: 'Monitoring kits for learning',
          title: 'A repairable monitoring kit for learning spaces and school workshops',
          description:
            'The kit combines interchangeable sensors with clear experiment sheets. Participating learning spaces test different activities and collect repair instructions.',
          icon: 'graduation-cap'
        },
        {
          id: 'mh-projects-map-preview',
          type: 'point',
          date: '2020-09-15',
          label: 'The map opens to everyone',
          title: 'The shared map opens for public preview',
          description:
            'Routes, workshop spaces and selected monitoring stations can be explored through one interface for the first time.',
          icon: 'code'
        },
        {
          id: 'mh-projects-accessible-map',
          type: 'period',
          start: '2021-01',
          end: '2025-04',
          label:
            'An urban map for different routes, ways of perceiving and technical circumstances',
          title:
            'An accessible urban map with clear navigation, traceable data sources and different ways of moving through public space',
          description:
            'The map offers alternative representations and step-by-step navigation. Feedback from exploration sessions informs labels, controls and descriptions of uncertain data.',
          icon: 'code',
          tags: ['Accessibility', 'Open data']
        },
        {
          id: 'mh-projects-district-stations',
          type: 'period',
          start: '2023-02',
          label: 'Modular neighbourhood stations',
          title: 'A collaboratively maintained network of modular neighbourhood stations',
          description:
            'Interchangeable modules support observations of weather, water and energy. Each station documents the origin, maintenance and known limits of its measurements.',
          icon: 'layers'
        },
        {
          id: 'mh-projects-data-platform',
          type: 'period',
          start: '2024-05',
          label: 'The shared data platform',
          title: 'A shared data platform for maps, measurements and workshop documentation',
          description: {
            body: 'The platform connects previously separate archives through **reusable interfaces**. Groups can add their data gradually and document it themselves.\n\nThe shared core includes:\n\n- Maps and measurements with traceable origins\n- Workshop notes that state their date precision clearly\n- Documented limitations and open questions\n\nEach group remains responsible for its own contributions.'
          },
          icon: 'layers',
          image: {
            src: '/timeline-creative.svg',
            alt: 'Schematic interface with an illustration, lines of text and two content cards',
            width: 640,
            height: 360,
            aspect: '16/9'
          },
          tags: ['Open data', 'Interfaces'],
          action: {
            label: 'Back to the timeline',
            href: '#morgenhafen-timeline',
            variant: 'secondary'
          }
        },
        {
          id: 'mh-projects-shade-canopy',
          type: 'period',
          start: '2025-06-12',
          end: '2025-06-13',
          label: 'A day in the shade',
          title: 'A one-day trial of a movable shade canopy',
          description:
            'A temporary canopy is tried in several positions on a square. Observations and feedback are reviewed together the following day.',
          icon: 'sprout'
        },
        {
          id: 'mh-projects-night-measurement',
          type: 'period',
          start: '2025-06-12',
          end: '2025-06-14',
          label: 'Comparing day and night',
          title: 'Two days and nights with mobile monitoring stations',
          description:
            'Mobile stations remain in one place across two daily cycles. The group compares temperature, use and documented maintenance interventions.',
          icon: 'code'
        },
        {
          id: 'mh-projects-shared-api',
          type: 'point',
          date: '2026-11-25',
          label: 'One interface for archives',
          title: 'The shared data interface connects its first archives',
          description:
            'Maps and measurements can now be read through the same documented interface. The first release includes examples for small local archives.',
          tags: ['API', 'Open data']
        }
      ]
    },
    {
      id: 'publications',
      title: 'Publications & exchange',
      icon: 'book-open',
      color: '#AD7119',
      events: [
        {
          id: 'mh-publications-workshop-guide',
          type: 'point',
          date: '2005',
          label: 'The first workshop booklet',
          title: 'The first workshop booklet: starting together and recording what we learn',
          description:
            'Short guides explain tool loans, shared repairs and documentation of experiments. The booklet is deliberately easy to extend.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-water-atlas',
          type: 'point',
          date: '2012-09',
          label: 'Water routes atlas',
          title: 'Atlas of neighbourhood water routes',
          description:
            'The atlas combines collaboratively drawn maps with observations after rainfall. Open questions and incomplete entries remain visible.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-observatory-report',
          type: 'point',
          date: '2016-12-08',
          label: 'Seven years of observation',
          title: 'Seven years of urban observation: methods, maintenance and open questions',
          description:
            'A shared report explains which measurements are comparable and where procedures changed. Maintenance experience receives a chapter of its own.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-2018-repair-notes',
          type: 'point',
          date: '2018-05-10',
          label: 'Sharing repair knowledge',
          title: 'Describing repair knowledge together',
          description:
            'The first publication from the workshop days compares short repair logs with detailed instructions. Examples show which information can be missing when repeating a repair.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-2018-workshop-notes',
          type: 'point',
          date: '2018-05-11',
          label: 'Workshop days notes',
          title: 'Workshop days: notes from open experiments',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-2018-maintenance',
          type: 'point',
          date: '2018-05-12',
          label: 'Who takes care tomorrow?',
          title: 'Who takes care tomorrow? Maintenance in shared labs',
          description:
            'The closing contribution from the workshop days collects tested handover practices. It also describes work that has not yet been reliably shared.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-access-guide',
          type: 'point',
          date: '2021-06',
          label: 'Welcoming workshops',
          title: 'Welcoming workshops: orientation, access and clear information',
          description:
            'A guide brings together feedback from open access reviews. Examples address physical routes as well as invitations, forms and digital maps.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-2024-station-handbook',
          type: 'point',
          date: '2024-10-17',
          label: 'Neighbourhood station handbook',
          title: 'Understanding, building and maintaining neighbourhood stations together',
          description:
            'Part of the shared publication day: the handbook covers site selection through to documented maintenance. Replaceable components are explained individually.',
          icon: 'book-open',
          tags: ['2024 publication series']
        },
        {
          id: 'mh-publications-2024-data-format',
          type: 'point',
          date: '2024-10-17',
          label: 'A format for monitoring networks',
          title: 'An open data format for small, collaboratively operated monitoring networks',
          description:
            'The format description connects measurements with device, location and maintenance information. Small sample datasets accompany the shared publication series.',
          icon: 'code',
          tags: ['2024 publication series', 'Open data']
        },
        {
          id: 'mh-publications-2024-rain-atlas',
          type: 'point',
          date: '2024-10-17',
          label: 'Rain in the neighbourhood',
          title: 'Rain in the neighbourhood: maps, observations and traceable uncertainties',
          description:
            'The new atlas edition shows water routes alongside their supporting observations. Uncertain connections and missing measurements are explicitly described.',
          icon: 'book-open',
          tags: ['2024 publication series']
        },
        {
          id: 'mh-publications-2024-component-catalogue',
          type: 'point',
          date: '2024-10-17',
          label:
            'Component catalogue for repairable, collaboratively operated and consistently documented neighbourhood stations',
          title:
            'Reusable components for repairable public monitoring stations: housings, mounts and connectors for collaboratively maintained and consistently documented neighbourhood networks',
          description:
            'The catalogue describes enclosures, mounts and connectors together with their limitations. It is released alongside the station handbook and data format.',
          icon: 'layers',
          tags: ['2024 publication series']
        },
        {
          id: 'mh-publications-2024-energy-patterns',
          type: 'point',
          date: '2024-10-17',
          label: 'Everyday energy displays',
          title: 'Energy displays in everyday use: patterns from shared spaces',
          description:
            'The report compares feedback on several display variants. It records which labels remained understandable in everyday use and which were revised.',
          icon: 'book-open',
          tags: ['2024 publication series']
        },
        {
          id: 'mh-publications-2024-accessible-map',
          type: 'point',
          date: '2024-10-17',
          label: 'More than one route',
          title:
            'More than one route: accessible maps for different journeys and ways of perceiving',
          description:
            'The publication describes alternative map representations and tested navigation steps. Examples come from shared exploration sessions within the fictional urban lab.',
          icon: 'book-open',
          tags: ['2024 publication series', 'Accessibility']
        },
        {
          id: 'mh-publications-2024-maintenance-log',
          type: 'point',
          date: '2024-10-17',
          label: 'The shared maintenance log',
          title:
            'A maintenance log for shared infrastructure: handovers, spare parts and traceable changes',
          description:
            'Templates connect short inspection rounds with more detailed repair reports. The final part of the publication series also addresses open questions about long-term stewardship.',
          icon: 'book-open',
          tags: ['2024 publication series']
        },
        {
          id: 'mh-publications-2025-shade-protocol',
          type: 'point',
          date: '2025-06-12',
          label: 'Comparing shade canopies',
          title: 'Experiment sheet for movable shade canopies',
          description:
            'An experiment sheet for comparable observations is released at the start of open lab week. It leaves room for feedback beyond the prepared questions.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-2025-night-observations',
          type: 'point',
          date: '2025-06-13',
          label: 'Recording day and night',
          title: 'Recording day and night: a guide for mobile monitoring groups',
          description:
            'The guide covers site photographs, inspection times and missing values. It accompanies the ongoing experiment during open lab week.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-2025-charter-notes',
          type: 'point',
          date: '2025-06-14',
          label: 'The lab charter explained',
          title: 'Notes on the shared lab charter',
          description:
            'Short examples show how groups can agree access, maintenance and handovers. The notes are released with the new charter.',
          icon: 'book-open'
        },
        {
          id: 'mh-publications-2025-field-cards',
          type: 'point',
          date: '2025-06-17',
          label: 'Field cards to take along',
          title: 'Field cards for shared observations of water, shade and sound',
          description:
            'The card set brings together three simple observation activities from open lab week. The reverse sides provide space for sketches, deviations and further questions.',
          icon: 'palette'
        }
      ]
    },
    {
      id: 'research',
      title: 'Research & learning',
      icon: 'graduation-cap',
      color: '#8555B7',
      events: [
        {
          id: 'mh-research-listening-walks',
          type: 'period',
          start: '2004-09',
          end: '2005-06',
          label: 'First explorations',
          title: 'Listening and walking together: first neighbourhood explorations',
          description:
            'Small groups collect questions about everyday routes and shared places. Their findings determine which workshop experiments take place first.',
          icon: 'graduation-cap'
        },
        {
          id: 'mh-research-local-archive',
          type: 'period',
          start: '2006',
          end: '2010',
          label: 'Making knowledge findable',
          title: 'An accessible archive for maps and workshop knowledge',
          description:
            'Groups try different ways of organising paper, images and digital files. Feedback from new participants helps make terminology and procedures easier to understand.',
          icon: 'book-open'
        },
        {
          id: 'mh-research-map-review',
          type: 'point',
          date: '2008-06',
          label: 'Reviewing the maps together',
          title: 'Public review of the first neighbourhood maps',
          description:
            'A shared walk identifies missing routes and unclear symbols. The findings inform the next edition of the atlas.',
          icon: 'graduation-cap'
        },
        {
          id: 'mh-research-groundwater',
          type: 'period',
          start: '2011-05',
          end: '2015-10',
          label: 'Understanding everyday water',
          title: 'Local water observation between measurements and everyday experience',
          description:
            'The study compares measurements with recorded observations after rainfall. Differences are retained as starting points for new questions.',
          icon: 'sprout'
        },
        {
          id: 'mh-research-data-literacy',
          type: 'period',
          start: '2016-01',
          end: '2022-12',
          label: 'Reading urban data together',
          title: 'Open learning sessions on reading, checking and describing urban data',
          description:
            'Learners work with small extracts from the shared archives. Each session combines analysis with questions about origin, uncertainty and clear presentation.',
          icon: 'graduation-cap'
        },
        {
          id: 'mh-research-sensory-routes',
          type: 'period',
          start: '2018-04',
          end: '2020-04',
          label: 'Experiencing routes differently',
          title: 'Different perceptions along the same routes',
          description:
            'Accompanied exploration sessions collect experiences of sound, orientation and comfort. They inform requirements for later map representations.',
          icon: 'heart'
        },
        {
          id: 'mh-research-2018-cohort',
          type: 'point',
          date: '2018-05-11',
          label: 'Learning to measure together',
          title: 'The first cohort completes the open monitoring workshop',
          description:
            'At the end of the learning programme, groups present their experiments and their limitations. The contributions are discussed publicly during the workshop days.',
          icon: 'award'
        },
        {
          id: 'mh-research-longitudinal-access',
          type: 'period',
          start: '2022-01',
          label: 'Understanding access over time',
          title: 'Long-term observation of access and participation in the open urban lab',
          description:
            'Recurring conversations and documented use situations show who the activities reach. The study follows practical changes without generalising from isolated observations.',
          icon: 'graduation-cap'
        },
        {
          id: 'mh-research-field-notebook',
          type: 'point',
          date: '2023-03-22',
          title: 'The open methods notebook is released'
        },
        {
          id: 'mh-research-methods-residency',
          type: 'period',
          start: '2025-06-12',
          end: '2025-06-19',
          label: 'Trying methods together',
          title: 'An open methods residency during lab week',
          description:
            'Participants compare observation sheets, map sketches and short interviews. New variants are tried directly in the public experiments.',
          icon: 'graduation-cap'
        }
      ]
    }
  ]
};
