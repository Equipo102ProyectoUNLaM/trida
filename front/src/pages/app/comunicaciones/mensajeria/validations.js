import * as Yup from 'yup';

export const mensajesSchema = Yup.object().shape({
  textoMensaje: Yup.string().required('El mensaje es requerido'),
  asunto: Yup.string().required('El asunto es requerido'),
});
