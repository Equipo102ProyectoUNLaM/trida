import React from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import { getDocument, addDocument, editDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { storage } from 'helpers/Firebase';
import FileUploader from 'react-firebase-file-uploader';

class FormSubirPractica extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      mensaje: '',
      idMateria: '',
      isLoading: true,
      isFileUploading: false,
      isFileUploaded: false,
      fileUploadProgress: 0,
      fileURL: '',
      file: '',
    };
  }

  componentDidMount() {
    //this.getDoc();
    this.setState({
      isLoading: false,
    });
  }

  getDoc = async () => {
    /* if (this.props.id) {
      const { data } = await getDocument(`practicas/${this.props.id}`);
      const {
        nombre,
        descripcion,
        fechaLanzada,
        fechaVencimiento,
        idArchivo,
      } = data;
      this.setState({
        nombre,
        descripcion,
        fechaLanzada,
        fechaVencimiento,
        file: idArchivo,
      });
    }
    this.setState({
      isLoading: false,
    });
    return;*/
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleUploadStart = () => {
    if (this.state.file !== '') {
      this.handleDeleteFile();
    }
    this.setState({ isFileUploading: true, fileUploadProgress: 0 });
  };

  handleProgress = (progress) =>
    this.setState({ fileUploadProgress: progress });

  handleUploadError = (error) => {
    this.setState({ isFileUploading: false });
    console.error(error);
  };

  handleUploadSuccess = async (filename) => {
    this.setState({
      file: filename,
      fileUploadProgress: 100,
      isFileUploading: false,
      isFileUploaded: true,
    });

    await storage
      .ref('materias/' + this.props.subject.id + '/correcciones/')
      .child(filename)
      .getDownloadURL()
      .then((url) => this.setState({ fileURL: url }));
  };

  handleDeleteFile = async () => {
    storage
      .ref('materias/' + this.props.subject.id + '/correcciones/')
      .child(this.state.file)
      .delete();
    this.setState({
      isFileUploading: false,
      isFileUploaded: false,
      fileUploadProgress: 0,
      fileURL: '',
      file: '',
    });
  };

  onFileSubmit = async (values) => {
    const nombrePractica = await this.getNombrePractica();
    const { mensaje } = values;
    const obj = {
      nombre: nombrePractica,
      mensaje: mensaje,
      idPractica: this.props.id,
      idUsuario: this.props.user,
      idMateria: this.props.subject.id,
      idArchivo: this.state.file,
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
      <Formik
        initialValues={initialValues}
        onSubmit={this.onFileSubmit}
        //validationSchema={formSubirPracticaSchema}
      >
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
              <label className="practicas-adjuntar-button">
                Adjuntar Archivo
                <FileUploader
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  hidden
                  name="archivo"
                  randomizeFilename
                  storageRef={storage.ref(
                    'materias/' + this.props.subject.id + '/correcciones/'
                  )}
                  onUploadStart={this.handleUploadStart}
                  onUploadError={this.handleUploadError}
                  onUploadSuccess={this.handleUploadSuccess}
                  onProgress={this.handleProgress}
                />
              </label>
              {this.state.file && (
                <div>
                  <div className="practica-file-element">
                    <p>1 Archivo adjunto</p>
                  </div>
                  <div
                    className="glyph-icon simple-icon-trash delete-action-icon practica-file-element"
                    onClick={this.handleDeleteFile}
                  />
                </div>
              )}
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

export default connect(mapStateToProps)(FormSubirPractica);
