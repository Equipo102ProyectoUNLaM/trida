import { groupBy } from 'lodash';
import { getCollection } from 'helpers/Firebase-db';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import firebase from 'firebase/app';

export const getCorrecciones = async (materiaId) => {
  let evalPorAlumno = [];
  let practicasPorAlumno = [];
  let openData = [];

  const alumnos = await getUsuariosAlumnosPorMateria(materiaId);

  const evaluacionesVencidas = await getCollection(
    'evaluaciones',
    [
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'fecha_finalizacion', operator: '<', id: new Date() },
    ],
    [{ order: 'fecha_finalizacion', orderCond: 'desc' }]
  );

  const practicasVencidas = await getCollection(
    'practicas',
    [
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'fechaVencimiento', operator: '<', id: new Date() },
    ],
    [{ order: 'fechaVencimiento', orderCond: 'desc' }]
  );

  const correccionesEval = await getCollection('correcciones', [
    {
      field: 'tipo',
      operator: '==',
      id: 'evaluacion',
    },
    { field: 'idMateria', operator: '==', id: materiaId },
  ]);

  const correccionesPractica = await getCollection('correcciones', [
    {
      field: 'tipo',
      operator: '==',
      id: 'practica',
    },
    { field: 'idMateria', operator: '==', id: materiaId },
  ]);

  alumnos.forEach((alumno) => {
    practicasVencidas.forEach((practica) => {
      practicasPorAlumno.push({
        id: alumno.id,
        idPractica: practica.id,
        nombreUsuario: alumno.nombre,
        estado: 'No entregado',
      });
    });

    evaluacionesVencidas.forEach((evaluacion) => {
      evalPorAlumno.push({
        id: alumno.id,
        idEval: evaluacion.id,
        nombreUsuario: alumno.nombre,
        estado: 'No entregado',
      });
    });
  });

  practicasPorAlumno.forEach((practica) => {
    correccionesPractica.forEach((correccion) => {
      if (
        practica.idPractica === correccion.data.idPractica &&
        practica.id === correccion.data.idUsuario
      ) {
        practica.estado = correccion.data.estadoCorreccion
          ? correccion.data.estadoCorreccion
          : correccion.data.estado;
      }
    });
  });

  evalPorAlumno.forEach((evaluacion) => {
    correccionesEval.forEach((correccion) => {
      if (
        evaluacion.idEval === correccion.data.idEntrega &&
        evaluacion.id === correccion.data.idUsuario
      ) {
        evaluacion.estado = correccion.data.estadoCorreccion
          ? correccion.data.estadoCorreccion
          : correccion.data.estado;
      }
    });
  });

  evalPorAlumno = groupBy(evalPorAlumno, 'nombreUsuario');
  practicasPorAlumno = groupBy(practicasPorAlumno, 'id');

  const evaluacionesResumen = Object.keys(evalPorAlumno).map((alumno) => {
    const evalu = evalPorAlumno[alumno];
    const agrupadoPorEstado = groupBy(evalu, 'estado');
    openData.push(false);
    return {
      id: evalu[0].id,
      nombreUsuario: evalu[0].nombreUsuario,
      cantEvalTotal: evalu.length,
      estadisticasEval: agrupadoPorEstado,
    };
  });

  const practicasResumen = Object.keys(practicasPorAlumno).map((alumno) => {
    const practica = practicasPorAlumno[alumno];
    const agrupadoPorEstado = groupBy(practica, 'estado');

    return {
      id: practica[0].id,
      nombreUsuario: practica[0].nombreUsuario,
      cantPracticasTotal: practica.length,
      estadisticasPracticas: agrupadoPorEstado,
    };
  });

  const resumen = evaluacionesResumen.map((res) => {
    const practica = practicasResumen.find(({ id }) => id === res.id);

    if (practica) {
      return {
        ...res,
        cantPracticasTotal: practica.cantPracticasTotal,
        estadisticasPracticas: practica.estadisticasPracticas,
      };
    }

    return res;
  });

  return { resumen, openData };
};

export const getAsistencias = async (materiaId, resumen) => {
  const clasesCollection = await getCollection('clases', [
    {
      field: 'fecha_clase',
      operator: '<',
      id: firebase.firestore.Timestamp.now(),
    },
    { field: 'idMateria', operator: '==', id: materiaId },
    { field: 'activo', operator: '==', id: true },
  ]);

  const usuarios = await getUsuariosAlumnosPorMateria(materiaId);

  const clasesPromise = clasesCollection.map(async (clase) => {
    return {
      id: clase.id,
      asistencia: clase.data.asistencia,
      idMateria: clase.data.idMateria,
      nombre: clase.data.nombre,
      fecha: clase.data.fecha_clase,
    };
  });

  let clases = await Promise.all(clasesPromise);
  let asistenciaClase = [];

  for (let clase of clases) {
    usuarios.forEach((alumno) => {
      asistenciaClase.push(getAsistencia(clase, alumno));
    });
  }

  asistenciaClase = groupBy(asistenciaClase, 'userId');

  const resumenTotal = resumen.map((res) => {
    if (asistenciaClase[res.id]) {
      return {
        ...res,
        cantClasesTotal: asistenciaClase[res.id].length,
        estadisticasClases: asistenciaClase[res.id],
      };
    }

    return res;
  });
  return resumenTotal;
};

export const getAsistencia = (clase, usuario) => {
  if (clase.asistencia) {
    const asistenciaUsuario = clase.asistencia.filter(
      (asistencia) => asistencia.user === usuario.id
    );
    if (asistenciaUsuario.length) {
      let tiempoAsistencia = 0;
      for (const asist of asistenciaUsuario) {
        tiempoAsistencia += asist.tiempoNeto;
      }
      return {
        id: clase.id,
        tiempo: tiempoAsistencia,
        userId: usuario.id,
        user: usuario.nombre,
        nombreClase: clase.nombre,
        fecha: clase.fecha,
      };
    }
  }
  return {
    id: clase.id,
    tiempo: 0,
    userId: usuario.id,
    user: usuario.nombre,
    nombreClase: clase.nombre,
    fecha: clase.fecha,
  };
};
