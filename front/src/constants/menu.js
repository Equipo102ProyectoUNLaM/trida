const data = [
  {
    id: 'virtual-classes',
    icon: 'iconsminds-blackboard',
    label: 'menu.clases-virtuales',
    to: '/app/clases-virtuales',
    subs: [
      {
        icon: 'iconsminds-book',
        label: 'menu.mis-clases',
        to: '/app/clases-virtuales/mis-clases',
      },
    ],
  },
  {
    id: 'content',
    icon: 'simple-icon-cloud-upload',
    label: 'menu.content',
    to: '/app/contenidos',
    subs: [
      {
        icon: 'simple-icon-cloud-upload',
        label: 'menu.my-contents',
        to: '/app/contenidos',
      },
    ],
  },
  {
    id: 'communications',
    icon: 'iconsminds-mail',
    label: 'menu.communications',
    to: '/app/comunicaciones',
    subs: [
      {
        icon: 'iconsminds-speach-bubble-comic-2',
        label: 'menu.forum',
        to: '/app/comunicaciones/foro',
      },
      {
        icon: 'simple-icon-paper-plane',
        label: 'menu.messages',
        to: '/app/comunicaciones/mensajeria',
      },
      {
        icon: 'iconsminds-receipt-4',
        label: 'menu.formal',
        to: '/app/comunicaciones/formales',
      },
    ],
  },
  {
    id: 'activities',
    icon: 'iconsminds-library',
    label: 'menu.activities',
    to: '/app/practicas',
    subs: [
      {
        icon: 'iconsminds-library',
        label: 'menu.my-activities',
        to: '/app/practicas',
      },
    ],
  },
  {
    id: 'evaluations',
    icon: 'simple-icon-note',
    label: 'menu.evaluations',
    to: '/app/evaluaciones',
    subs: [
      {
        icon: 'simple-icon-note',
        label: 'menu.my-evaluations',
        to: '/app/evaluaciones',
      },
    ],
  },
  {
    id: 'corrections',
    icon: 'simple-icon-check',
    label: 'menu.corrections',
    to: '/app/correcciones',
    subs: [
      {
        icon: 'simple-icon-check',
        label: 'menu.my-corrections',
        to: '/app/correcciones',
      },
    ],
  },
];
export default data;
