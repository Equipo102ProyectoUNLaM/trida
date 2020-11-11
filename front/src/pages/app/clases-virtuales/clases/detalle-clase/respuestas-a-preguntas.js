import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardBody,
  CardTitle,
  Progress,
  Badge,
  Tooltip,
} from 'reactstrap';
import {
  getCollectionWithSubCollections,
  getDocument,
} from 'helpers/Firebase-db';
import { getUsuariosPorMateriaConRol } from 'helpers/Firebase-user';
import { desencriptarPreguntasConRespuestasDeAlumnos } from 'handlers/DecryptionHandler';
import { isEmpty } from 'helpers/Utils';
import ROLES from 'constants/roles';

const RespuestasAPreguntas = ({
  isLoading,
  idClase,
  rolDocente,
  user,
  idMateria,
}) => {
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(isLoading);
  const [respuestasDeAlumno, setRespuestasDeAlumno] = useState([]);
  const [tooltipOpen, setTooltip] = useState(false);

  useEffect(() => {
    getPreguntasConRespuestasDeAlumnos();
  }, [idClase]);

  const getPreguntasConRespuestasDeAlumnos = async () => {
    let preguntasEncriptadasConRespuestas = [];
    preguntasEncriptadasConRespuestas = await getCollectionWithSubCollections(
      `clases/${idClase}/preguntas`,
      false,
      false,
      'respuestas'
    );

    if (preguntasEncriptadasConRespuestas.length > 0) {
      const sinRespuesta = false;
      const preguntasConRespuestas = desencriptarPreguntasConRespuestasDeAlumnos(
        preguntasEncriptadasConRespuestas,
        sinRespuesta
      );

      if (!rolDocente) getRespuestasDeAlumno(preguntasConRespuestas);
      crearCantRespuestasPorPregunta(preguntasConRespuestas);
    } else {
      setIsLoadingLocal(false);
    }
  };

  const getRespuestasDeAlumno = async (preguntas) => {
    let respuestasDeAlumno = [];
    for (const preg of preguntas) {
      const [rtaAlumno] = preg.data.subcollections.filter(
        (elem) => elem.id === user
      );
      if (rtaAlumno)
        respuestasDeAlumno.push({
          id: preg.id,
          rtas: rtaAlumno.data.respuestas,
        });
    }
    setRespuestasDeAlumno(respuestasDeAlumno);
  };

  const crearCantRespuestasPorPregunta = async (preguntasConRespuestas) => {
    const resumen = [];
    if (preguntasConRespuestas.length > 0) {
      for (const preg of preguntasConRespuestas) {
        let resultado = [];
        let opciones = [];
        let cantTotalRtas = 0;
        let alumnosContestaron = [];
        for (let i = 0; i < preg.data.base.opciones.length; i++) {
          // Obtengo el titulo de cada opcion
          opciones.push(preg.data.base.opciones[i].opcion);
          resultado.push(0);
        }
        // Obtengo array de cuales son las rtas verdaderas
        const idxRtasVerdaderas = preg.data.base.opciones
          .map((opc, idx) => (opc.verdadera ? idx : ''))
          .filter(String);

        preg.data.subcollections.forEach((sub) => {
          alumnosContestaron.push(sub.id);
          if (rolDocente || sub.id === user) {
            sub.data.respuestas.forEach((res) => {
              // incremento la opcion elegida por el alumno
              resultado[res]++;
              cantTotalRtas++;
            });
          }
        });
        const alumnosSinRespuesta = await getAlumnosSinRespuesta(
          alumnosContestaron
        );
        resumen.push({
          id: preg.id,
          consigna: preg.data.base.consigna,
          resultado: resultado,
          opciones: opciones,
          respuestasVerdaderas: idxRtasVerdaderas,
          cantTotalRtas: cantTotalRtas,
          alumnosSinRespuesta,
        });
      }
      setRespuestasPorPregunta(resumen);
      setIsLoadingLocal(false);
    }
  };

  const getAlumnosSinRespuesta = async (alumnosContestaron) => {
    let usuariosNoContestaronNombres = [];
    // Traigo los usuarios de la materia y filtro solo los que son alumnos
    const usuariosMateria = await getUsuariosPorMateriaConRol(idMateria);
    const usuariosAlumnos = usuariosMateria.filter(
      (user) => user.rol === ROLES.Alumno
    );

    // Filtro los usuarios que no contestaron
    const usuariosNoContestaron = usuariosAlumnos.filter((user) => {
      return alumnosContestaron.indexOf(user.id) === -1;
    });
    for (const user of usuariosNoContestaron) {
      const { data } = await getDocument(`usuarios/${user.id}`);
      usuariosNoContestaronNombres.push(
        data.nombre + ' ' + data.apellido + ', '
      );
    }

    // Lo que viene abajo es para remover la coma del último del array
    if (!isEmpty(usuariosNoContestaronNombres)) {
      usuariosNoContestaronNombres[
        usuariosNoContestaronNombres.length - 1
      ] = usuariosNoContestaronNombres[
        usuariosNoContestaronNombres.length - 1
      ].slice(
        0,
        usuariosNoContestaronNombres[usuariosNoContestaronNombres.length - 1]
          .length - 2
      );
    }
    //
    return usuariosNoContestaronNombres;
  };

  const refreshRespuestas = async () => {
    setTooltip(false);
    setIsLoadingLocal(true);
    getPreguntasConRespuestasDeAlumnos();
  };

  return isLoadingLocal ? (
    <div className="loading" />
  ) : (
    <>
      {isEmpty(respuestasPorPregunta) && (
        <span>No hay respuestas cargadas</span>
      )}
      <i
        className="iconsminds-refresh cursor-pointer refresh-respuestas"
        onClick={refreshRespuestas}
        id="refrescar-rtas"
      >
        <Tooltip
          placement="right"
          isOpen={tooltipOpen}
          target="refrescar-rtas"
          toggle={() => setTooltip(!tooltipOpen)}
        >
          Actualizar Respuestas
        </Tooltip>
      </i>

      {respuestasPorPregunta.map((rta, idx) => {
        return (
          <Card key={idx} className="h-100 card-respuestas">
            <CardBody>
              <CardTitle>{rta.consigna}</CardTitle>
              {rta.resultado.map((opcion, index) => {
                return (
                  <div key={index} className="mb-4">
                    <div className="mb-2">
                      {rta.opciones[index]}
                      <span className="float-right text-default">
                        {rta.respuestasVerdaderas.includes(index) &&
                          rolDocente && (
                            <Badge
                              color="danger"
                              pill
                              className="badge-respuestas"
                            >
                              Correcta
                            </Badge>
                          )}
                        {rolDocente && (
                          <span>
                            {opcion}/{rta.cantTotalRtas}
                          </span>
                        )}
                      </span>
                    </div>
                    {rolDocente && (
                      <Progress value={(opcion / rta.cantTotalRtas) * 100} />
                    )}
                    {!rolDocente && (
                      <Progress
                        value={
                          respuestasDeAlumno.some(
                            (rt) => rt.id === rta.id && rt.rtas.includes(index)
                          )
                            ? 100
                            : 0
                        }
                      />
                    )}
                  </div>
                );
              })}
              {rolDocente && !isEmpty(rta.alumnosSinRespuesta) && (
                <div>
                  <span className="font-weight-bold">
                    Alumnos que no contestaron:{' '}
                  </span>
                  {rta.alumnosSinRespuesta}
                </div>
              )}
            </CardBody>
          </Card>
        );
      })}
    </>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(RespuestasAPreguntas);
