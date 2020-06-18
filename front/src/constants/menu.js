const data = [
  {
    id: "comunicaciones",
    icon: "iconsminds-mail",
    label: "menu.comunicaciones",
    to: "/app/comunicaciones",
    subs: [
      {
        icon: "iconsminds-speach-bubble-comic-2",
        label: "menu.foro",
        to: "/app/comunicaciones/foro"
      },
      {
        icon: "simple-icon-paper-plane",
        label: "menu.mensajeria",
        to: "/app/comunicaciones/mensajeria"
      },
      {
        icon: "iconsminds-receipt-4",
        label: "menu.formales",
        to: "/app/comunicaciones/formales"
      }      
    ]
  },
  {
    id: "contenidos",
    icon: "simple-icon-cloud-upload",
    label: "menu.contenidos",
    to: "/app/contenidos",
    subs: [
      {
        icon: "simple-icon-cloud-upload",
        label: "menu.mis-contenidos",
        to: "/app/contenidos"
      }
    ]
  },
  {
    id: "correcciones",
    icon: "simple-icon-check",
    label: "menu.correcciones",
    to: "/app/correcciones",
    subs: [
      {
        icon: "simple-icon-check",
        label: "menu.mis-correcciones",
        to: "/app/correcciones"
      }
    ]
  },
  {
    id: "clase-virtual",
    icon: "iconsminds-blackboard",
    label: "menu.classes",
    to: "/app/clases-virtuales",
    subs: [
      {
        icon: "iconsminds-book",
        label: "menu.my-classes",
        to: "/app/clases-virtuales/classes"
      },
      {
        icon: "iconsminds-blackboard",
        label: "menu.board",
        to: "/app/clases-virtuales/board"
      }
    ]
  },
  {
    id: "practicas",
    icon: "iconsminds-library",
    label: "menu.practicas",
    to: "/app/practicas",
    subs: [
      {
        icon: "iconsminds-library",
        label: "menu.mis-practicas",
        to: "/app/practicas"
      }
    ]
  },
  {
    id: "evaluaciones",
    icon: "simple-icon-note",
    label: "menu.evaluaciones",
    to: "/app/evaluaciones",
    subs: [
      {
        icon: "simple-icon-note",
        label: "menu.mis-evaluaciones",
        to: "/app/evaluaciones"
      }
    ]
  }
];
export default data;
