import * as Yup from 'yup';

export const formClaseSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  descripcion: Yup.string().required('La descripción es requerida'),
  fecha_clase: Yup.string().required('La fecha de clase es requerida'),
});
