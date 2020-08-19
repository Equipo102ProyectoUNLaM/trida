import {
  UPDATE_INSTITUTION,
  UPDATE_COURSE,
  UPDATE_SUBJECT,
  CLEAN_SELECCION_CURSO,
} from '../actions';

export const updateInstitution = (institution) => ({
  type: UPDATE_INSTITUTION,
  payload: { institution },
});

export const updateCourse = (course) => ({
  type: UPDATE_COURSE,
  payload: { course },
});

export const updateSubject = (subject) => ({
  type: UPDATE_SUBJECT,
  payload: { subject },
});

export const cleanSeleccionCurso = () => ({
  type: CLEAN_SELECCION_CURSO,
  payload: {},
});
