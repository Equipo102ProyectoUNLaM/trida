import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

export const desencriptarEjercicios = (ejercicios) => {
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
        opcion.verdadera =
          CryptoJS.AES.decrypt(opcion.verdadera, secretKey).toString(
            CryptoJS.enc.Utf8
          ) === 'true';
      }
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
    evaluacion.data.base.fecha_finalizacion = CryptoJS.AES.decrypt(
      evaluacion.data.base.fecha_finalizacion,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    evaluacion.data.base.fecha_publicacion = CryptoJS.AES.decrypt(
      evaluacion.data.base.fecha_publicacion,
      secretKey
    ).toString(CryptoJS.enc.Utf8);
    if (evaluacion.data.subcollections) {
      evaluacion.data.subcollections = desencriptarEjercicios(
        evaluacion.data.subcollections
      );
    }
  });
  return result;
};

export const desencriptarTexto = (texto) => {
  return CryptoJS.AES.decrypt(texto, secretKey).toString(CryptoJS.enc.Utf8);
};
