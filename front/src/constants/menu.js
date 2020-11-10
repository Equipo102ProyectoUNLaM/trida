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
    icon: 'iconsminds-folder-cloud',
    label: 'menu.content',
    to: '/app/contenidos',
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
  },
  {
    id: 'evaluations',
    icon: 'iconsminds-file-edit',
    label: 'menu.evaluations',
    to: '/app/evaluaciones',
    subs: [
      {
        icon: 'iconsminds-testimonal',
        label: 'menu.evaluations-write',
        to: '/app/evaluaciones/escritas',
      },
      {
        icon: 'iconsminds-speach-bubble-dialog',
        label: 'menu.evaluations-oral',
        to: '/app/evaluaciones/orales',
      },
    ],
  },
  {
    id: 'corrections',
    icon: 'iconsminds-check',
    label: 'menu.corrections',
    to: '/app/correcciones',
  },
  {
    id: 'admin',
    icon: 'iconsminds-gear',
    label: 'menu.admin',
    to: '/app/admin',
  },
];
export default data;
