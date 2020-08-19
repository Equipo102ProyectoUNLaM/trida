import {
  UPDATE_INSTITUTION,
  UPDATE_COURSE,
  UPDATE_SUBJECT,
  CLEAN_SELECCION_CURSO,
} from '../actions';

const INIT_STATE = {
  institution: '',
  course: '',
  subject: '',
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_INSTITUTION:
      return {
        ...state,
        institution: action.payload.institution,
      };
    case UPDATE_SUBJECT:
      return {
        ...state,
        subject: action.payload.subject,
      };
    case UPDATE_COURSE:
      return {
        ...state,
        course: action.payload.course,
      };
    case CLEAN_SELECCION_CURSO:
      return {
        ...state,
        institution: '',
        course: '',
        subject: '',
      };

    default:
      return { ...state };
  }
};
