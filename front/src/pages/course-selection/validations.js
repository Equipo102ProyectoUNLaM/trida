import * as Yup from 'yup';
const phoneRegExp = /^[0-9]+$/;

export const formInstitucionSchema = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
  telefono: Yup.string().matches(
    phoneRegExp,
    'El número de teléfono es inválido, solo se aceptan números'
  ),
});
