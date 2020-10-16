import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { createUUID, createRandomString } from 'helpers/Utils';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import { capitalizeString } from 'helpers/Utils';
import { FormikDatePicker } from 'containers/form-validations/FormikFields';
import { getDocument, addDocument, editDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { formClaseSchema } from './validations';

// const FormClase = ({
//   toggleModal,
//   onClaseGuardada,
//   subject,
//   user,
//   idClase,
//   nombre,
//   fecha,
//   descripcion,
//   sala,
// }) => {
//   const { handleSubmit, errors, control } = useForm();
//   const [switchVideollamada, setSwitchVideollamada] = useState(sala);

//   const onSubmit = async (values) => {
//     let idSala = '';
//     const { nombre, fecha, descripcion } = values;
//     if (switchVideollamada) {
//       const uuid = createUUID();
//       idSala = CryptoJS.AES.encrypt(uuid, secretKey).toString();
//     }
//     const obj = {
//       nombre: capitalizeString(nombre),
//       fecha,
//       descripcion,
//       idSala,
//       password: createRandomString(),
//       idMateria: subject.id,
//       contenidos: [],
//     };

//     if (idClase) {
//       await editDocument(
//         'clases',
//         idClase,
//         obj,
//         'Clase editada',
//         'Clase editada',
//         'Error al guardar la clase'
//       );
//     } else {
//       await addDocument(
//         'clases',
//         obj,
//         user,
//         'Clase agregada',
//         'Clase agregada exitosamente',
//         'Error al agregar la clase'
//       );
//     }

//     onClaseGuardada();
//   };

//   return (
//     <form
//       className="av-tooltip tooltip-label-right"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <FormGroup className="mb-3 error-l-150">
//         <Label>Nombre de la clase</Label>
//         <Controller
//           as={Input}
//           control={control}
//           name="nombre"
//           defaultValue={nombre || ''}
//           rules={{
//             required: { value: true, message: 'El nombre es requerido' },
//           }}
//         />
//         {errors.nombre && (
//           <div className="invalid-feedback d-block">
//             {errors.nombre.message}
//           </div>
//         )}
//       </FormGroup>

//       <FormGroup className="mb-3 error-l-150">
//         <Label>Fecha</Label>
//         <Controller
//           as={
//             <FormikDatePicker
//               name="fecha_clase"
//               // value={values.fecha_clase}
//               placeholder="Ingrese la fecha de la clase"
//             />
//           }
//           control={control}
//           name="fecha"
//           defaultValue={fecha || ''}
//           type="date"
//           placeholder="DD/MM/AAAA"
//           rules={{
//             required: { value: true, message: 'La fecha es requerida' },
//           }}
//         />
//         {errors.fecha_clase && (
//           <div className="invalid-feedback d-block">{errors.fecha.message}</div>
//         )}
//       </FormGroup>

//       <FormGroup className="mb-3 error-l-150">
//         <Label>Descripción</Label>
//         <Controller
//           as={Input}
//           control={control}
//           name="descripcion"
//           defaultValue={descripcion || ''}
//           type="textarea"
//           rules={{
//             required: { value: true, message: 'La descripción es requerida' },
//           }}
//         />
//         {errors.descripcion && (
//           <div className="invalid-feedback d-block">
//             {errors.descripcion.message}
//           </div>
//         )}
//       </FormGroup>

//       <FormGroup className="form-check-switch">
//         <Label>¿Esta clase tendrá videollamada?</Label>
//         <Switch
//           checked={switchVideollamada}
//           id="Tooltip-Switch"
//           className="custom-switch custom-switch-primary"
//           onChange={(value) => {
//             setSwitchVideollamada(value);
//           }}
//           checkedChildren="Si"
//           unCheckedChildren="No"
//         />
//       </FormGroup>
//       <ModalFooter className="card-notas">
//         <Button color="primary" type="submit">
//           {idClase ? 'Editar' : 'Agregar'}
//         </Button>
//         <Button color="secondary" onClick={toggleModal}>
//           Cancelar
//         </Button>
//       </ModalFooter>
//     </form>
//   );
// };

class FormClase extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      descripcion: '',
      fecha_clase: '',
      idMateria: '',
      isLoading: true,
      switchVideollamada: false,
      idSala: '',
      password: '',
      contenidos: [],
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    if (this.props.id) {
      const { data } = await getDocument(`clases/${this.props.id}`);
      const {
        nombre,
        descripcion,
        fecha_clase,
        idSala,
        password,
        contenidos,
      } = data;
      this.setState({
        nombre,
        descripcion,
        fecha_clase,
        idSala,
        password,
        contenidos,
      });
    }
    this.setState({
      isLoading: false,
    });
    return;
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  setSwitchVideollamada = (value) => {
    this.setState({
      switchVideollamada: value,
    });
  };

  onClaseSubmit = async (values) => {
    let idSala = '';
    const { nombre, fecha_clase, descripcion } = values;
    if (this.state.switchVideollamada) {
      const uuid = createUUID();
      idSala = CryptoJS.AES.encrypt(uuid, secretKey).toString();
    }
    const obj = {
      nombre: capitalizeString(nombre),
      fecha_clase,
      descripcion,
      idSala,
      password: createRandomString(),
      idMateria: this.props.subject.id,
      contenidos: this.state.contenidos,
    };

    if (this.props.id) {
      await editDocument(
        'clases',
        this.props.id,
        obj,
        'Clase editada',
        'Clase editada',
        'Error al guardar la clase'
      );
    } else {
      await addDocument(
        'clases',
        obj,
        this.props.user,
        'Clase agregada',
        'Clase agregada exitosamente',
        'Error al agregar la clase'
      );
    }

    this.props.onClaseGuardada();
  };

  render() {
    const { toggleModal, textConfirm } = this.props;
    const {
      isLoading,
      nombre,
      descripcion,
      fecha_clase,
      switchVideollamada,
    } = this.state;
    const initialValues = {
      nombre: nombre,
      descripcion: descripcion,
      fecha_clase: fecha_clase,
    };
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onClaseSubmit}
        validationSchema={formClaseSchema}
      >
        {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <FormGroup className="mb-3 error-l-150">
              <Label>Nombre de la clase</Label>
              <Field
                className="form-control"
                name="nombre"
                type="textarea"
                autocomplete="off"
              />
              {errors.nombre && touched.nombre && (
                <div className="invalid-feedback d-block">{errors.nombre}</div>
              )}
            </FormGroup>

            <FormGroup className="mb-3 error-l-75">
              <Label>Descripción</Label>
              <Field
                autocomplete="off"
                className="form-control"
                name="descripcion"
                type="textarea"
              />
              {errors.descripcion && touched.descripcion && (
                <div className="invalid-feedback d-block">
                  {errors.descripcion}
                </div>
              )}
            </FormGroup>

            <FormGroup className="mb-3 error-l-100">
              <Label>Fecha y Hora de la clase</Label>
              <FormikDatePicker
                name="fecha_clase"
                value={values.fecha_clase}
                placeholder="Ingrese la fecha de la clase"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
              {errors.fecha_clase && touched.fecha_clase ? (
                <div className="invalid-feedback d-block">
                  {errors.fecha_clase}
                </div>
              ) : null}
            </FormGroup>

            <FormGroup className="form-check-switch">
              <Label>¿Esta clase tendrá videollamada?</Label>
              <Switch
                checked={switchVideollamada}
                id="Tooltip-Switch"
                className="custom-switch custom-switch-primary"
                onChange={(value) => {
                  this.setSwitchVideollamada(value);
                }}
                checkedChildren="Si"
                unCheckedChildren="No"
              />
            </FormGroup>

            <ModalFooter>
              <Button color="primary" type="submit">
                {textConfirm}
              </Button>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user } = authUser;
  const { subject } = seleccionCurso;
  return { user, subject };
};

export default connect(mapStateToProps)(FormClase);
