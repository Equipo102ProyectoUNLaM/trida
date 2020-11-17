import LINKS from './links';

const ayudaAlumno = [
  {
    question: 'General',
    answer: `<strong>Menú</strong><br/>
    En el menú lateral encontrarás cada uno de los módulos con los que cuenta la aplicación. Para desplegarlo, clickeá el ícono que se encuentra a la izquierda del nombre de tu institución.<br/><br/>
    <iframe width="560" height="315" src=${LINKS.ALUMNO.GENERAL.MENU} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
   
    <strong>Barra Superior</strong><br/>
    En la barra superior podrás ver distintas opciones para personalizar la aplicación y tu cuenta.<br/><br/>
    <iframe width="560" height="315" src=${LINKS.ALUMNO.GENERAL.TOP_NAV} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>

    <strong>Notificaciones</strong><br/>
    En la barra superior podrás ver notificaciones cada vez que recibas un mensaje directo o un archivo para corregir. Para verlas, clickeá el ícono de la campana.<br/><br/>
    <iframe width="560" height="315" src=${LINKS.ALUMNO.GENERAL.NOTIFICACIONES} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
`,
  },
  {
    question: 'Clases Virtuales',
    answer: `En el módulo de clases virtuales podrás ingresar a las clases cargadas por tu docente. Podrás realizar consultas anónimas y escritas durante la clase. Además, podrás ver contenidos asociados a la clase.<br/><br/>
        <strong>Clase Virtual</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.CLASES.CLASE_VIRTUAL} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
        <strong>Preguntas de la Clase</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.CLASES.PREGUNTAS_CLASE} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
        <strong>Preguntas Anónimas</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.CLASES.PREGUNTAS_ALUMNO} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
        <strong>Contenidos de Clase</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.CLASES.CONTENIDOS} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
        `,
  },
  {
    question: 'Evaluaciones',
    answer: `En el módulo de evaluaciones podrás realizar las evaluaciones cargadas por tu docente. Prestá atención a las características de la evaluación cuando clickees 'Realizar', ya que tu docente puede haber seleccionado que no puedas navegar fuera de la evaluación o no puedas tomar capturas de pantalla.<br/><br/>
                  <strong>Realizar Evaluación Escrita</strong><br/><br/>
                  <iframe width="560" height="315" src=${LINKS.ALUMNO.EVALUACIONES.REALIZAR} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
                  <strong>Realizar Evaluación Oral</strong><br/><br/>
                  <iframe width="560" height="315" src=${LINKS.ALUMNO.EVALUACIONES.REALIZAR_EVALUACIONES_ORALES} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
                  `,
  },
  {
    question: 'Prácticas',
    answer: `En este módulo podrás subir las prácticas cargadas por tu docente.<br/><br/>
        <strong>Subir Prácticas</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.PRACTICAS.SUBIR} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
      `,
  },
  {
    question: 'Correcciones',
    answer: `En el módulo de correcciones podrás ver las correcciones realizadas por tu docente a las prácticas y evaluaciones que le envíes.<br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.CORRECCIONES.VER} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
      `,
  },
  {
    question: 'Contenidos',
    answer: `En el módulo de Contenidos podrás ver y descargar contenidos cargados por tu docente.<br /><br/>
                  <iframe width="560" height="315" src=${LINKS.ALUMNO.CONTENIDOS.VER} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
    `,
  },
  {
    question: 'Comunicaciones',
    answer: `En el módulo de Comunicaciones podrás interactuar con tus compañeros y tu docente por distintos canales.<br /><br/>
        <strong>Foro</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.COMUNICACIONES.FORO} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
        <strong>Mensajería</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.COMUNICACIONES.MENSAJERIA} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
        <strong>Comunicaciones Formales</strong><br/><br/>
        <iframe width="560" height="315" src=${LINKS.ALUMNO.COMUNICACIONES.FORMALES} frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><br/><br/>
       
          `,
  },
];

export default ayudaAlumno;
