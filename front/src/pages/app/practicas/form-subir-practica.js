import React from 'react';
import { connect } from 'react-redux';
import {
  ModalFooter,
  Button,
  FormGroup,
  Label,
  InputGroup,
  CustomInput,
  Row,
} from 'reactstrap';
import { getDocument, addDocument, editDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import { createUUID } from 'helpers/Utils';
import { subirArchivoAStorage } from 'helpers/Firebase-storage';
import IntlMessages from 'helpers/IntlMessages';

const acceptedFiles = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'application/pdf',
];

class FormSubirPractica extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      mensaje: '',
      idMateria: '',
      isLoading: true,
      file: '',
      fileExtension: '',
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleFileChange = (event) => {
    event.preventDefault();
    const { files } = event.target;
    if (!files || !files.length) return;
    let reader = new FileReader();
    let file = files[0];

    if (!acceptedFiles.includes(file.type)) {
      enviarNotificacionError(
        'Extensión de archivo no válida',
        'Archivo no admitido'
      );
      event.target.value = null;
      return;
    }

    reader.onloadend = () => {
      const archivo = reader.result;
      const splittedName = file.name.split('.');
      const fileExtension = splittedName[splittedName.length - 1];
      this.setState({ file: file, fileExtension: fileExtension });
    };

    reader.readAsDataURL(file);
  };

  onFileSubmit = async (values) => {
    if (!this.state.file) {
      enviarNotificacionError(
        'Debes adjuntar una práctica para poder continuar',
        'Archivo faltante'
      );
      return;
    }

    this.setState({ isLoading: true });
    const nombrePractica = await this.getNombrePractica();
    const { mensaje } = values;

    const uuid = createUUID();
    const fileName = uuid + '.' + this.state.fileExtension;
    const path = 'materias/' + this.props.subject.id + '/correcciones/';
    const url = await subirArchivoAStorage(path, this.state.file, fileName);

    const obj = {
      nombre: nombrePractica,
      mensaje: mensaje,
      idPractica: this.props.id,
      idUsuario: this.props.user,
      idMateria: this.props.subject.id,
      idArchivo: fileName,
      tipo: 'practica',
      estado: 'No Corregido',
    };
    await addDocument(
      'correcciones',
      obj,
      this.props.user,
      'Práctica subida',
      'Práctica subida exitosamente',
      'Error al subir la práctica'
    );
    await this.editPracticaEstado();
    this.setState({ isLoading: false });
    this.props.onSubirPracticaOperacion();
  };

  editPracticaEstado = async () => {
    const obj = this.getDoc();
    await editDocument('practicas', this.props.id, obj, null);
  };

  getDoc = async () => {
    const { data } = await getDocument(`practicas/${this.props.id}`);
    const {
      nombre,
      descripcion,
      fechaLanzada,
      fechaVencimiento,
      idArchivo,
    } = data;
    const obj = {
      nombre: nombre,
      fechaLanzada: fechaLanzada,
      descripcion: descripcion,
      fechaVencimiento: fechaVencimiento,
      idMateria: this.props.subject.id,
      idArchivo: idArchivo,
      estado: 'subida',
    };

    return obj;
  };

  getNombrePractica = async () => {
    const { data } = await getDocument(`practicas/${this.props.id}`);
    const { nombre } = data;
    return nombre;
  };

  render() {
    const { toggleModal, textConfirm } = this.props;
    const { isLoading, nombre, mensaje } = this.state;
    const initialValues = {
      nombre: nombre,
      mensaje: mensaje,
    };
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Formik initialValues={initialValues} onSubmit={this.onFileSubmit}>
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <FormGroup className="mb-3 error-l-75">
              <Label>Mensaje</Label>
              <Field
                className="form-control"
                name="mensaje"
                type="textarea"
                autoComplete="off"
              />
              {errors.mensaje && touched.mensaje && (
                <div className="invalid-feedback d-block">{errors.mensaje}</div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Adjuntar Archivo</Label>
              <Row className="tip-text ml-0">
                {' '}
                <i className="iconsminds-arrow-right-in-circle mr-1" />{' '}
                <IntlMessages id="activity.adjuntar-practica-extensiones" />
              </Row>
              <InputGroup className="mb-3">
                <CustomInput
                  type="file"
                  label="Adjuntá la práctica correspondiente"
                  id="adjuntar-practica"
                  name="practica"
                  onInputCapture={(e) => this.handleFileChange(e)}
                />
              </InputGroup>
            </FormGroup>

            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button color="primary" type="submit">
                {textConfirm}
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

export default connect(mapStateToProps)(FormSubirPractica);
