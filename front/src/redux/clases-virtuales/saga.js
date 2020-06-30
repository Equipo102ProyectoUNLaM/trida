import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { firestore } from '../../helpers/Firebase';
import {
  AGREGAR_CLASE,
  AGREGAR_CLASE_ERROR,
  AGREGAR_CLASE_SUCCESS,
} from '../actions';

import {
  agregarClaseSuccess,
  agregarClaseError,
  agregarClase,
} from './actions';

export function* watchCrearClase() {
  yield takeEvery(AGREGAR_CLASE, agregarClase);
}

function* agregarClases({ payload }) {
  const { nombre, fecha, descripción, idSala } = payload.clase;

  try {
    firestore
      .collection('clases')
      .add({
        nombre: this.state.nombre,
        fecha: this.state.fecha,
        descripcion: this.state.descripcion,
        idSala: this.state.idSala,
      })
      .then((authUser) => authUser)
      .catch((error) => error);

    if (!error) {
      yield put(agregarClaseSuccess(loginUser.user));
    } else {
      yield put(agregarClaseError(loginUser.message));
    }
  } catch (error) {
    yield put(agregarClaseError(error));
  }
}

export default function* rootSaga() {
  yield all([fork(watchAgregarClase)]);
}
