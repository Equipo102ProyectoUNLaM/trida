import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

export const encriptarEjercicios = (ejercicios) => {
  let result = ejercicios;
  for (const ejercicio of result) {
    ejercicio.tipo = CryptoJS.AES.encrypt(ejercicio.tipo, secretKey).toString();
    ejercicio.nombre = CryptoJS.AES.encrypt(
      ejercicio.nombre,
      secretKey
    ).toString();
    ejercicio.numero = CryptoJS.AES.encrypt(
      ejercicio.numero.toString(),
      secretKey
    ).toString();
    if (ejercicio.consigna)
      ejercicio.consigna = CryptoJS.AES.encrypt(
        ejercicio.consigna,
        secretKey
      ).toString();
    if (ejercicio.tema)
      ejercicio.tema = CryptoJS.AES.encrypt(
        ejercicio.tema,
        secretKey
      ).toString();
    if (ejercicio.opciones) {
      for (const opcion of ejercicio.opciones) {
        opcion.opcion = CryptoJS.AES.encrypt(
          opcion.opcion,
          secretKey
        ).toString();
        opcion.verdadera = CryptoJS.AES.encrypt(
          opcion.verdadera.toString(),
          secretKey
        ).toString();
      }
    }
  }
  return result;
};

export const encriptarTexto = (texto) => {
  return CryptoJS.AES.encrypt(texto, secretKey).toString();
};
