import * as Yup from 'yup';

export const evaluationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  descripcion: Yup.string().required('La descripción es requerida'),
  fecha_finalizacion: Yup.date()
    .nullable()
    .required('La fecha de finalización es requerida'),
  fecha_publicacion: Yup.date()
    .nullable()
    .required('La fecha de publicación es requerida'),
});
