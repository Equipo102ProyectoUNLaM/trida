import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Progress, Badge } from 'reactstrap';
import { getCollectionWithSubCollections } from 'helpers/Firebase-db';
import { desencriptarPreguntasConRespuestasDeAlumnos } from 'handlers/DecryptionHandler';

const RespuestasAPreguntas = ({ isLoading, idClase }) => {
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(isLoading);
  const [
    preguntasConRespuestasDeAlumnos,
    setPreguntasConRespuestasDeAlumnos,
  ] = useState([]);
  var preguntasConRespuestasDeAlumnosGlobal = []; // ver de sacarla

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

      setPreguntasConRespuestasDeAlumnos(preguntasConRespuestas); // deberia hacer esto en vez del var preguntasConRespuestasDeAlumnosGlobal, pero no lo carga
      preguntasConRespuestasDeAlumnosGlobal = preguntasConRespuestas;
      crearCantRespuestasPorPregunta();
    }
  };

  const crearCantRespuestasPorPregunta = () => {
    const resumen = [];

    if (preguntasConRespuestasDeAlumnosGlobal.length > 0) {
      preguntasConRespuestasDeAlumnosGlobal.forEach((preg) => {
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
          sub.data.respuestas.forEach((res) => {
            // incremento la opcion elegida por el alumno
            resultado[res]++;
            cantTotalRtas++;
          });
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
                        {opcion}/{rta.cantTotalRtas}
                      </span>
                    </div>
                    <Progress value={(opcion / rta.cantTotalRtas) * 100} />
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

export default RespuestasAPreguntas;
