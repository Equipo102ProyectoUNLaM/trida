import * as Yup from 'yup';

export const evaluationSchema = Yup.object().shape({
  nombre: Yup.string().required('Debe ingresar un nombre para la evaluación'),
  descripcion: Yup.string().required(
    'Debe ingresar una descripción para la evaluación'
  ),
  fecha_finalizacion: Yup.date()
    .nullable()
    .required('Debe ingresar una fecha de finalización'),
  fecha_publicacion: Yup.date()
    .nullable()
    .required('Debe ingresar una fecha de publicación'),
});
