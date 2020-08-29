import * as Yup from 'yup';

export const formPracticaSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  descripcion: Yup.string().required('La descripción es requerida'),
  fechaLanzada: Yup.string().required('La fecha de lanzamiento es requerida'),
  fechaVencimiento: Yup.string().required(
    'La fecha de vencimiento es requerida'
  ),
});
