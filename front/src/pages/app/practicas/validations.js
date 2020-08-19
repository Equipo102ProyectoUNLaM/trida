import * as Yup from 'yup';

export const formPracticaSchema = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
  descripcion: Yup.string().required('Este campo es requerido'),
  fechaLanzada: Yup.string().required('Este campo es requerido'),
  fechaVencimiento: Yup.string().required('Este campo es requerido'),
});
