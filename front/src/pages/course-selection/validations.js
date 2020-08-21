import * as Yup from 'yup';

export const formInstitucionSchema = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
});
