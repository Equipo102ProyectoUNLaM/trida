const data = [
  {
    id: "communications",
    icon: "iconsminds-mail",
    label: "menu.communications",
    to: "/app/communications",
    subs: [
      {
        icon: "iconsminds-speach-bubble-comic-2",
        label: "menu.forum",
        to: "/app/communications/forum"
      },
      {
        icon: "simple-icon-paper-plane",
        label: "menu.messages",
        to: "/app/communications/messages"
      },
      {
        icon: "iconsminds-receipt-4",
        label: "menu.formal",
        to: "/app/communications/formal"
      }      
    ]
  },
  {
    id: "content",
    icon: "simple-icon-cloud-upload",
    label: "menu.content",
    to: "/app/content",
    subs: [
      {
        icon: "simple-icon-cloud-upload",
        label: "menu.my-contents",
        to: "/app/content"
      }
    ]
  },
  {
    id: "corrections",
    icon: "simple-icon-check",
    label: "menu.corrections",
    to: "/app/corrections",
    subs: [
      {
        icon: "simple-icon-check",
        label: "menu.my-corrections",
        to: "/app/corrections"
      }
    ]
  },
  {
    id: "virtual-classes",
    icon: "iconsminds-blackboard",
    label: "menu.virtual-classes",
    to: "/app/virtual-classes",
    subs: [
      {
        icon: "iconsminds-book",
        label: "menu.my-classes",
        to: "/app/virtual-classes/my-classes"
      },
      {
        icon: "iconsminds-blackboard",
        label: "menu.board",
        to: "/app/virtual-classes/board"
      }
    ]
  },
  {
    id: "activities",
    icon: "iconsminds-library",
    label: "menu.activities",
    to: "/app/activities",
    subs: [
      {
        icon: "iconsminds-library",
        label: "menu.my-activities",
        to: "/app/activities"
      }
    ]
  },
  {
    id: "evaluations",
    icon: "simple-icon-note",
    label: "menu.evaluations",
    to: "/app/evaluations",
    subs: [
      {
        icon: "simple-icon-note",
        label: "menu.my-evaluations",
        to: "/app/evaluations"
      }
    ]
  }
];
export default data;
