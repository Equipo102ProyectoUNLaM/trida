const data = [
  {
    id: "comunicaciones",
    icon: "iconsminds-mail",
    label: "menu.comunicaciones",
    to: "/app",
    subs: [
      {
        icon: "iconsminds-speach-bubble-comic-2",
        label: "menu.foro",
        to: "/app/inicio/start"
      },
      {
        icon: "simple-icon-paper-plane",
        label: "menu.mensajeria",
        to: "/app/inicio/start"
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
    id: "docs",
    icon: "iconsminds-blackboard",
    label: "menu.clases",
    to: "/app",
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
