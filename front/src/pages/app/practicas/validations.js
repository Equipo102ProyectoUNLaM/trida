import * as Yup from 'yup';

export const formPracticaSchema = Yup.object().shape({
  nombre: Yup.string().required('La práctica debe tener un nombre'),
  descripcion: Yup.string().required('El campo descripción es obligatorio'),
  fechaLanzada: Yup.string().required('La fecha de lanzamiento es obligatoria'),
  fechaVencimiento: Yup.string().required(
    'La fecha de vencimiento de entrega es obligatoria'
  ),
});
