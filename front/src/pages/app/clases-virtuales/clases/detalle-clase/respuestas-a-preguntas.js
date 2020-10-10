import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardTitle, Progress } from 'reactstrap';

import IntlMessages from 'helpers/IntlMessages';
import {
  getCollectionOnSnapshot,
  getDatosClaseOnSnapshot,
  getCollectionWithSubCollections,
} from 'helpers/Firebase-db';
import { desencriptarPreguntasConRespuestasDeAlumnos } from 'handlers/DecryptionHandler';

const RespuestasAPreguntas = ({
  isLoading,
  idClase,
  cardClass = 'h-100',
  preguntasConRespuestasDeAlumnos,
}) => {
  const [respuestasPorPregunta, setRespuestasPorPregunta] = useState([]);

  const data = [
    {
      title: 'Opción 1',
      total: 18,
      status: 12,
    },
    {
      title: 'Opción 2',
      total: 8,
      status: 1,
    },
    {
      title: 'Opción 3',
      total: 6,
      status: 2,
    },
  ];

  useEffect(() => {
    crearCantRespuestasPorPregunta();
  });

  const crearCantRespuestasPorPregunta = () => {
    /*       let respuestas = []
      let obj = [{ }];
      let i = 0; //idx de cada pregunta
      for (const pregunta of preguntasConRespuestasDeAlumnos) {
        console.log("pregunta",  pregunta);
        obj[i].consgina = pregunta.data.base.consigna;
        for (const respuestas of pregunta.data.subcollections ) {
          console.log("respuestas", respuestas);
        }
        
      }

      console.log("obj", obj);
*/
    const resumen = [];
    if (preguntasConRespuestasDeAlumnos.length > 0) {
      preguntasConRespuestasDeAlumnos.forEach((preg) => {
        let resultado = [];
        for (let i = 0; i < preg.data.base.opciones.length; i++) {
          resultado.push(0);
        }
        preg.data.subcollections.forEach((sub) => {
          sub.data.respuestas.forEach((res) => {
            resultado[res]++;
          });
        });
        resumen.push({
          id: preg.id,
          consigna: preg.data.base.consigna,
          resultados: resultado,
        });
      });
      console.log('resumen', resumen);
    }
  };

  return isLoading ? (
    <div className="loading" />
  ) : (
    <Card className={cardClass}>
      <CardBody>
        <CardTitle>
          <IntlMessages id="clase.ver-respuestas" />
        </CardTitle>
        {data.map((s, index) => {
          return (
            <div key={index} className="mb-4">
              <p className="mb-2">
                {s.title}
                <span className="float-right text-muted">
                  {s.status}/{s.total}
                </span>
              </p>
              <Progress value={(s.status / s.total) * 100} />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};

export default RespuestasAPreguntas;
