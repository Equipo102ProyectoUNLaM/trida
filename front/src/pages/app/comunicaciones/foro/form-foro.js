import { editDocument, addDocument } from 'helpers/Firebase-db';
import { capitalizeString } from 'helpers/Utils';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button, FormGroup, Label, Row } from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import ROLES from 'constants/roles';
import { Formik, Form, Field } from 'formik';
import { mensajesSchema } from './validations';
import { createUserList } from 'helpers/Firebase-user';

// const FormForo = ({
//   toggleModal,
//   onForoGuardado,
//   subject,
//   user,
//   idForo,
//   nombre,
//   descripcion,
//   mensajes,
// }) => {
//   const { handleSubmit, errors, control } = useForm();

//   const onSubmit = async (values) => {
//     const { nombre, descripcion } = values;

//     const obj = {
//       nombre: capitalizeString(nombre),
//       descripcion,
//       idMateria: subject.id,
//     };

//     if (idForo) {
//       await editDocument(
//         'foros',
//         idForo,
//         obj,
//         'Tema editado',
//         'Tema editado',
//         'Error al guardar el tema'
//       );
//     } else {
//       await addDocument(
//         'foros',
//         obj,
//         user,
//         'Tema agregado',
//         'Tema agregado exitosamente',
//         'Error al agregar el tema'
//       );
//     }

//     onForoGuardado();
//   };

//   return (
//     <form
//       className="av-tooltip tooltip-label-right"
//       onSubmit={handleSubmit(onSubmit)}
//     >
//       <FormGroup className="mb-3 error-l-150">
//         <Label>Nombre del tema</Label>
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
//       <ModalFooter className="card-notas">
//         <Button color="primary" type="submit">
//           {idForo ? 'Editar' : 'Agregar'}
//         </Button>
//         <Button color="secondary" onClick={toggleModal}>
//           Cancelar
//         </Button>
//       </ModalFooter>
//     </form>
//   );
// };

class FormForo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: this.props.nombre ? this.props.nombre : '',
      descripcion: this.props.descripcion ? this.props.descripcion : '',
      selectedOptions: [],
      idMateria: this.props.subject.id,
      isLoading: false,
      idUser: this.props.user,
      esPrivado: this.props.privado ? this.props.privado : false,
      usuariosDelSelect: this.props.datosUsuarios
        ? this.props.datosUsuarios
        : [],
    };
  }

  async componentDidMount() {
    if (this.props.integrantes) {
      this.setState({
        selectedOptions: await createUserList(
          this.props.integrantes,
          this.props.user
        ),
      });
    }
  }

  handleChangeMulti = (selectedOptions) => {
    this.setState({ selectedOptions });
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  componentWillUnmount() {
    this.setState({
      usuariosDelSelect: [],
    });
  }

  disableCrearButton() {
    return (
      !this.state.esPrivado ||
      (this.state.selectedOptions.length === 0 && this.state.esPrivado)
    );
  }

  handleSubmit = async (values) => {
    let integrantes = null;
    if (!this.state.esPrivado) {
      integrantes = this.state.selectedOptions.map(({ value }) => value);
      integrantes.push(this.props.user);
    }

    const obj = {
      nombre: capitalizeString(values.nombre),
      descripcion: values.descripcion,
      idMateria: this.state.idMateria,
      privado: this.state.esPrivado,
      integrantes: this.state.esPrivado ? [] : integrantes,
    };

    if (this.props.idForo) {
      await editDocument(
        'foros',
        this.props.idForo,
        obj,
        'Tema editado',
        'Tema editado',
        'Error al guardar el tema'
      );
    } else {
      await addDocument(
        'foros',
        obj,
        this.props.user,
        'Tema agregado',
        'Tema agregado exitosamente',
        'Error al agregar el tema'
      );
    }

    this.props.onForoGuardado();
  };

  handleCheckBoxChange = async () => {
    this.setState({
      esPrivado: !this.state.esPrivado,
    });
    if (this.state.esPrivado) {
      this.setState({
        selectedOptions: [],
      });
    }
  };

  render() {
    const {
      isLoading,
      selectedOptions,
      nombre,
      descripcion,
      esPrivado,
      usuariosDelSelect,
    } = this.state;
    const { toggleModal, rol, idForo } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Formik
        initialValues={{
          nombre: nombre,
          esPrivado: esPrivado,
          descripcion: descripcion,
          usuariosDelSelect: usuariosDelSelect,
        }}
        onSubmit={this.handleSubmit}
        validationSchema={mensajesSchema}
      >
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right" autoComplete="off">
            <FormGroup className="mb-3 asunto-msj ">
              <Label>Nombre</Label>
              <Field name="nombre" className="form-control" />
              {errors.nombre && touched.nombre ? (
                <div className="invalid-feedback d-block">{errors.nombre}</div>
              ) : null}
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Descripcion</Label>
              <Field
                autoComplete="off"
                name="descripcion"
                component="textarea"
                className="form-control"
              />
              {errors.descripcion && touched.descripcion ? (
                <div className="invalid-feedback d-block">
                  {errors.descripcion}
                </div>
              ) : null}
            </FormGroup>
            <Row>
              <Colxx xxs="12" md="12">
                <label>
                  <IntlMessages id="forums.participants" />
                </label>
                <Row>
                  <Colxx xxs="12" md="6" className="receivers-general">
                    <Field
                      autoComplete="off"
                      name="esPrivado"
                      className="general-check"
                      type="checkbox"
                      checked={esPrivado}
                      onChange={() => this.handleCheckBoxChange()}
                    />
                    <label>¿Es un foro privado?</label>
                  </Colxx>
                  <Colxx xxs="12" md="4">
                    <Select
                      className="react-select"
                      classNamePrefix="react-select"
                      isMulti
                      placeholder="Seleccioná los integrantes"
                      name="select_usuarios"
                      value={selectedOptions}
                      onChange={this.handleChangeMulti}
                      options={usuariosDelSelect}
                      required
                      isDisabled={!esPrivado}
                    />
                  </Colxx>
                </Row>
              </Colxx>
            </Row>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                disabled={this.disableCrearButton()}
              >
                {idForo ? 'Editar' : 'Agregar'}
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

export default connect(mapStateToProps)(FormForo);
