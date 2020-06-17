const data = [
  {
    id: "comunicaciones",
    icon: "iconsminds-mail",
    label: "menu.comunicaciones",
    to: "/app/gogo",
    subs: [
      {
        icon: "iconsminds-speach-bubble-comic-2",
        label: "menu.foro",
        to: "/app/gogo/start"
      },
      {
        icon: "simple-icon-paper-plane",
        label: "menu.mensajeria",
        to: "/app/gogo/start"
      }    
    ]
  },
  {
    id: "contenidos",
    icon: "simple-icon-cloud-upload",
    label: "menu.contenidos",
    to: "/app/second-menu",
    subs: [
      {
        icon: "simple-icon-paper-plane",
        label: "menu.second",
        to: "/app/second-menu/second"
      }
    ]
  },
  {
    id: "correcciones",
    icon: "simple-icon-check",
    label: "menu.correcciones",
    to: "/app/blank-page"
  },
  {
    id: "clases",
    icon: "iconsminds-blackboard",
    label: "menu.virtual-classes",
    to: "/app/virtual-classes",
    subs: [
      {
        icon: "iconsminds-book",
        label: "menu.myclasses",
        to: "/app/virtual-classes/classes"
      },
      {
        icon: "iconsminds-blackboard",
        label: "menu.board",
        to: "/app/virtual-classes/board"
      }
    ]
  },
  {
    id: "practicas",
    icon: "iconsminds-library",
    label: "menu.practicas",
    to: "/app",
  },
  {
    id: "evaluaciones",
    icon: "simple-icon-note",
    label: "menu.evaluaciones",
    to: "/app",
  }
];
export default data;
