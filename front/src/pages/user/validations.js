import * as Yup from 'yup';
const phoneRegExp = /^[0-9]+$/;

export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Este campo es requerido')
    .min(6, 'La contraseña debe tener mas de 6 caracteres'),
  confirmPassword: Yup.string()
    .required('Este campo es requerido')
    .min(6, 'La contraseña debe tener mas de 6 caracteres')
    .when('password', {
      is: (val) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref('password')],
        'Las contraseñas deben ser iguales'
      ),
    }),
});

export const loginSchema = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
  apellido: Yup.string().required('Este campo es requerido'),
  telefono: Yup.string().matches(
    phoneRegExp,
    'El número de teléfono es inválido, solo se aceptan números'
  ),
});

export const primerLoginSchema = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
  apellido: Yup.string().required('Este campo es requerido'),
  telefono: Yup.string().matches(
    phoneRegExp,
    'El número de teléfono es inválido, solo se aceptan números'
  ),
});
