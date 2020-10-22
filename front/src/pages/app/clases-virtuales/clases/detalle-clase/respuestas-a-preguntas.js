import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Progress, Badge } from 'reactstrap';
import { getCollectionWithSubCollections } from 'helpers/Firebase-db';
import { desencriptarPreguntasConRespuestasDeAlumnos } from 'handlers/DecryptionHandler';
import { isEmpty } from 'helpers/Utils';

const RespuestasAPreguntas = ({ isLoading, idClase, rolDocente, user }) => {
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(isLoading);
  const [respuestasDeAlumno, setRespuestasDeAlumno] = useState([]);

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

  const crearCantRespuestasPorPregunta = (preguntasConRespuestas) => {
    const resumen = [];
    if (preguntasConRespuestas.length > 0) {
      preguntasConRespuestas.forEach((preg) => {
        let resultado = [];
        let opciones = [];
        let cantTotalRtas = 0;
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
          if (rolDocente || sub.id === user) {
            sub.data.respuestas.forEach((res) => {
              // incremento la opcion elegida por el alumno
              resultado[res]++;
              cantTotalRtas++;
            });
          }
        });
        resumen.push({
          id: preg.id,
          consigna: preg.data.base.consigna,
          resultado: resultado,
          opciones: opciones,
          respuestasVerdaderas: idxRtasVerdaderas,
          cantTotalRtas: cantTotalRtas,
        });
      });
      setRespuestasPorPregunta(resumen);
      setIsLoadingLocal(false);
    }
  };

  return isLoadingLocal ? (
    <div className="loading" />
  ) : (
    <>
      {isEmpty(respuestasPorPregunta) && (
        <span>No hay respuestas cargadas</span>
      )}
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
                        {rta.respuestasVerdaderas.includes(index) && (
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
