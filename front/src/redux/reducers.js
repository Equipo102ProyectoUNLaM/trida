import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import seleccionCurso from './institucion/reducer';

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  seleccionCurso,
});

export default reducers;
