import {
  AGREGAR_CLASE,
  AGREGAR_CLASE_SUCCESS,
  AGREGAR_CLASE_ERROR,
} from '../actions';

export const agregarClase = (clase) => ({
  type: AGREGAR_CLASE,
  payload: { clase },
});
export const agregarClaseSuccess = (clase) => ({
  type: AGREGAR_CLASE_SUCCESS,
  payload: clase,
});
export const agregarClaseError = (message) => ({
  type: AGREGAR_CLASE_ERROR,
  payload: { message },
});
