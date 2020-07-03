import {
  AGREGAR_CLASE,
  AGREGAR_CLASE_SUCCESS,
  AGREGAR_CLASE_ERROR,
} from '../actions';

/* const INIT_STATE = {
    clase: localStorage.getItem('user_id'),
    loading: false,
    error: ''
}; */

export default (state, action) => {
  switch (action.type) {
    case AGREGAR_CLASE:
      return { ...state, loading: true, error: '' };
    case AGREGAR_CLASE_SUCCESS:
      return { ...state, loading: false, clase: action.payload.id, error: '' };
    case AGREGAR_CLASE_ERROR:
      return {
        ...state,
        loading: false,
        user: '',
        error: action.payload.message,
      };
    default:
      return { ...state };
  }
};
