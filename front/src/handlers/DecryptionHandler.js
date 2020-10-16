import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

export const desencriptarEjercicios = (ejercicios, sinRespuesta) => {
  let result = ejercicios;
  for (const ejercicio of result) {
    ejercicio.data.tipo = CryptoJS.AES.decrypt(
      ejercicio.data.tipo,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    ejercicio.data.nombre = CryptoJS.AES.decrypt(
      ejercicio.data.nombre,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    ejercicio.data.numero = CryptoJS.AES.decrypt(
      ejercicio.data.numero.toString(),
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    if (ejercicio.data.consigna)
      ejercicio.data.consigna = CryptoJS.AES.decrypt(
        ejercicio.data.consigna,
        secretKey
      ).toString(CryptoJS.enc.Utf8);
    if (ejercicio.data.tema)
      ejercicio.data.tema = CryptoJS.AES.decrypt(
        ejercicio.data.tema,
        secretKey
      ).toString(CryptoJS.enc.Utf8);
    if (ejercicio.data.opciones) {
      for (const opcion of ejercicio.data.opciones) {
        opcion.opcion = CryptoJS.AES.decrypt(opcion.opcion, secretKey).toString(
          CryptoJS.enc.Utf8
        );
        if (!sinRespuesta) {
          opcion.verdadera =
            CryptoJS.AES.decrypt(opcion.verdadera, secretKey).toString(
              CryptoJS.enc.Utf8
            ) === 'true';
        }
      }
    }
    if (ejercicio.data.preguntas) {
      for (const pr of ejercicio.data.preguntas) {
        pr.opcion = CryptoJS.AES.decrypt(pr.opcion, secretKey).toString(
          CryptoJS.enc.Utf8
        );
      }
    }
    if (ejercicio.data.cantidad) {
      ejercicio.data.cantidad = CryptoJS.AES.decrypt(
        ejercicio.data.cantidad.toString(),
        secretKey
      ).toString(CryptoJS.enc.Utf8);
    }
  }
  return result;
};

export const desencriptarEvaluacion = (evaluaciones) => {
  let result = evaluaciones;
  result.forEach((evaluacion) => {
    evaluacion.data.base.descripcion = CryptoJS.AES.decrypt(
      evaluacion.data.base.descripcion,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    evaluacion.data.base.nombre = CryptoJS.AES.decrypt(
      evaluacion.data.base.nombre,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    evaluacion.data.base.sin_capturas =
      CryptoJS.AES.decrypt(
        evaluacion.data.base.sin_capturas,
        secretKey
      ).toString(CryptoJS.enc.Utf8) === 'true';
    evaluacion.data.base.sin_salir_de_ventana =
      CryptoJS.AES.decrypt(
        evaluacion.data.base.sin_salir_de_ventana,
        secretKey
      ).toString(CryptoJS.enc.Utf8) === 'true';
    if (evaluacion.data.subcollections) {
      evaluacion.data.subcollections = desencriptarEjercicios(
        evaluacion.data.subcollections
      );
    }
  });
  return result;
};

export const desencriptarEvaluacionImportada = (evaluaciones) => {
  let result = evaluaciones;
  result.forEach((evaluacion) => {
    evaluacion.data.descripcion = CryptoJS.AES.decrypt(
      evaluacion.data.descripcion,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    evaluacion.data.nombre = CryptoJS.AES.decrypt(
      evaluacion.data.nombre,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    evaluacion.data.fecha_finalizacion = evaluacion.data.fecha_finalizacion;
    evaluacion.data.fecha_publicacion = evaluacion.data.fecha_publicacion;
    evaluacion.data.sin_capturas =
      CryptoJS.AES.decrypt(evaluacion.data.sin_capturas, secretKey).toString(
        CryptoJS.enc.Utf8
      ) === 'true';
    evaluacion.data.sin_salir_de_ventana =
      CryptoJS.AES.decrypt(
        evaluacion.data.sin_salir_de_ventana,
        secretKey
      ).toString(CryptoJS.enc.Utf8) === 'true';
    if (evaluacion.subCollection) {
      evaluacion.subCollection = desencriptarEjercicios(
        evaluacion.subCollection
      );
    }
  });
  return result;
};

export const desencriptarTexto = (texto) => {
  return CryptoJS.AES.decrypt(texto, secretKey).toString(CryptoJS.enc.Utf8);
};

export const desencriptarPreguntasConRespuestasDeAlumnos = (
  preguntas,
  sinRespuesta
) => {
  let result = preguntas;
  for (const pregunta of result) {
    pregunta.data.base.tipo = CryptoJS.AES.decrypt(
      pregunta.data.base.tipo,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    pregunta.data.base.consigna = CryptoJS.AES.decrypt(
      pregunta.data.base.consigna,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    pregunta.data.base.nombre = CryptoJS.AES.decrypt(
      pregunta.data.base.nombre,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    pregunta.data.base.numero = CryptoJS.AES.decrypt(
      pregunta.data.base.numero,
      secretKey
    ).toString(CryptoJS.enc.Utf8);

    for (const opcion of pregunta.data.base.opciones) {
      opcion.opcion = CryptoJS.AES.decrypt(opcion.opcion, secretKey).toString(
        CryptoJS.enc.Utf8
      );
      if (!sinRespuesta) {
        opcion.verdadera =
          CryptoJS.AES.decrypt(opcion.verdadera, secretKey).toString(
            CryptoJS.enc.Utf8
          ) === 'true';
      }
    }
  }
  return result;
};
