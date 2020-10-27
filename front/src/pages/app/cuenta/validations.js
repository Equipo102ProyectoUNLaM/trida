import * as Yup from 'yup';

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

export const datosSchema = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
  apellido: Yup.string().required('Este campo es requerido'),
  telefono: Yup.number().required('Este campo es requerido'),
  mail: Yup.string()
    .email('El mail es inválido')
    .required('Este campo es requerido'),
});
