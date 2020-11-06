import {
  editDocument,
  addDocumentWithId,
  generateId,
} from 'helpers/Firebase-db';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Row,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Formik, Form, Field } from 'formik';
import { mensajesSchema } from './validations';
import { createUserList } from 'helpers/Firebase-user';
import { subirArchivoAStorage } from 'helpers/Firebase-storage';
import { enviarNotificacionError } from 'helpers/Utils-ui';
const publicUrl = process.env.PUBLIC_URL;
const imagenForo = `${publicUrl}/assets/img/imagen-foro.jpeg`;
const imageFiles = ['image/png', 'image/jpeg', 'image/jpg'];

class FormForo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: this.props.nombre ? this.props.nombre : '',
      descripcion: this.props.descripcion ? this.props.descripcion : '',
      imagen: this.props.imagen ? this.props.imagen : '',
      selectedOptions: [],
      idMateria: this.props.subject.id,
      isLoading: false,
      idUser: this.props.user,
      fotoForoText: 'Seleccioná una foto del foro',
      foto: '',
      fotoAMostrar: null,
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
    return this.state.selectedOptions.length === 0 && this.state.esPrivado;
  }

  handleSubmit = async (values) => {
    let integrantes = null;
    if (this.state.esPrivado) {
      integrantes = this.state.selectedOptions.map(({ value }) => value);
      integrantes.push(this.props.user);
    }
    let foroId = '';
    let url = this.state.imagen;
    if (this.state.foto) {
      if (this.props.idForo) {
        foroId = this.props.idForo;
      } else {
        foroId = await generateId(`materias/${this.props.subject.id}/foros`);
      }
      url = await this.subirFoto(this.state.foto, foroId);
    }

    const obj = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      idMateria: this.state.idMateria,
      privado: this.state.esPrivado,
      integrantes: !this.state.esPrivado ? [] : integrantes,
      imagen: url,
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
      await addDocumentWithId(
        'foros',
        foroId,
        this.props.user,
        obj,
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

  setSelectedFile = (event) => {
    let file = event.target.files[0];
    if (imageFiles.includes(file.type)) {
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          foto: file,
          fotoAMostrar: reader.result,
          fotoPerfilText: file.name,
        });
      };

      reader.readAsDataURL(file);
    } else {
      enviarNotificacionError(
        'Extensión de archivo no válida',
        'Archivo no admitido'
      );
    }
  };

  subirFoto = async (file, idForo) => {
    return await subirArchivoAStorage(
      `materias/${this.props.subject.id}/foros`,
      file,
      idForo
    );
  };

  removeRespuesta = () => {
    this.setState({
      imagen: '',
      fotoAMostrar: null,
      fotoPerfilText: '',
    });
  };

  render() {
    const {
      isLoading,
      selectedOptions,
      nombre,
      descripcion,
      esPrivado,
      usuariosDelSelect,
      imagen,
      fotoAMostrar,
    } = this.state;
    const { toggleModal, idForo } = this.props;
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
            <Row className="mb-3">
              <Colxx xxs="12" md="12">
                <label>
                  <IntlMessages id="forums.participants" />
                </label>
                <Row>
                  <Colxx xxs="12" md="4" className="receivers-general">
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
                  <Colxx xxs="12" md="8">
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
            <FormGroup className="form-group">
              <Label>Foto del foro</Label>
              <div style={{ flexDirection: 'row', display: 'flex' }}>
                <img
                  src={
                    fotoAMostrar
                      ? fotoAMostrar
                      : imagen !== ''
                      ? imagen
                      : imagenForo
                  }
                  alt="foto-default-foro"
                  className="edit-forums mb-2 padding-1 border-radius-50"
                />
                <div
                  className="glyph-icon simple-icon-close remove-icon mr-1"
                  onClick={() => this.removeRespuesta()}
                />
                <InputGroup className="foto-foro">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>Subir foto</InputGroupText>
                  </InputGroupAddon>
                  <div className="input-file">
                    <label
                      className="w-100 h-10 label-foto"
                      htmlFor="upload-photo"
                    >
                      {this.state.fotoPerfilText}
                    </label>
                    <input
                      onChange={this.setSelectedFile}
                      type="file"
                      name="foto"
                      id="upload-photo"
                    />
                  </div>
                </InputGroup>
              </div>
            </FormGroup>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={this.disableCrearButton()}
              >
                {idForo ? 'Editar' : 'Agregar'}
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
