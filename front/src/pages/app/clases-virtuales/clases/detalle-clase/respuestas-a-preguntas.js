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
    const resumen = [];
    if (preguntasConRespuestasDeAlumnos.length > 0) {
      preguntasConRespuestasDeAlumnos.forEach((preg) => {
        let resultado = [];
        let opciones = [];
        for (let i = 0; i < preg.data.base.opciones.length; i++) {
          opciones.push(preg.data.base.opciones[i].opcion);
          resultado.push(0);
        }
        const rtasVerdaderas = preg.data.base.opciones.findIndex(
          (opc) => opc.verdadera
        );
        preg.data.subcollections.forEach((sub) => {
          sub.data.respuestas.forEach((res) => {
            resultado[res]++;
          });
        });
        resumen.push({
          id: preg.id,
          consigna: preg.data.base.consigna,
          resultado: resultado,
          opciones: opciones,
          respuestasVerdaderas: rtasVerdaderas,
        });
      });
      setRespuestasPorPregunta(resumen);
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
