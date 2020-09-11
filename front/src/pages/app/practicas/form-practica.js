import React from 'react';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import { getDocument, addDocument, editDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { formPracticaSchema } from './validations';
import { storage } from 'helpers/Firebase';
import FileUploader from 'react-firebase-file-uploader';

class FormPractica extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      descripcion: '',
      fechaLanzada: '',
      fechaVencimiento: '',
      idMateria: '',
      estado: '',
      isLoading: true,
      isFileUploading: false,
      isFileUploaded: false,
      fileUploadProgress: 0,
      fileURL: '',
      file: '',
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    if (this.props.id) {
      const { data } = await getDocument(`practicas/${this.props.id}`);
      const {
        nombre,
        descripcion,
        fechaLanzada,
        fechaVencimiento,
        idArchivo,
        estado,
      } = data;
      this.setState({
        nombre,
        descripcion,
        fechaLanzada,
        fechaVencimiento,
        file: idArchivo,
        estado,
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

  handleUploadStart = () => {
    if (this.state.file != '') {
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

  handleUploadSuccess = (filename) => {
    this.setState({
      file: filename,
      fileUploadProgress: 100,
      isFileUploading: false,
      isFileUploaded: true,
    });
    storage
      .ref('materias/' + this.props.subject.id + '/practicas/')
      .child(filename)
      .getDownloadURL()
      .then((url) => this.setState({ fileURL: url }));
  };

  handleDeleteFile = async () => {
    storage
      .ref('materias/' + this.props.subject.id + '/practicas/')
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

  onPracticaSubmit = async (values) => {
    const { nombre, descripcion, fechaLanzada, fechaVencimiento } = values;
    if (this.props.operationType === 'add') {
      const obj = {
        nombre: nombre,
        fechaLanzada: fechaLanzada,
        descripcion: descripcion,
        fechaVencimiento: fechaVencimiento,
        idMateria: this.props.subject.id,
        idArchivo: this.state.file,
        estado: 'pendiente',
      };
      await addDocument(
        'practicas',
        obj,
        this.props.user,
        'Práctica agregada',
        'Práctica agregada exitosamente',
        'Error al agregar la práctica'
      );
    } else {
      const obj = {
        nombre: nombre,
        fechaLanzada: fechaLanzada,
        descripcion: descripcion,
        fechaVencimiento: fechaVencimiento,
        idArchivo: this.state.file,
        estado: 'pendiente',
      };
      await editDocument('practicas', this.props.id, obj, 'Práctica');
    }

    this.props.onPracticaOperacion();
  };

  render() {
    const { toggleModal, textConfirm } = this.props;
    const {
      isLoading,
      nombre,
      descripcion,
      fechaLanzada,
      fechaVencimiento,
    } = this.state;
    const initialValues = {
      nombre: nombre,
      descripcion: descripcion,
      fechaLanzada: fechaLanzada,
      fechaVencimiento: fechaVencimiento,
    };
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onPracticaSubmit}
        validationSchema={formPracticaSchema}
      >
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <FormGroup className="mb-3 error-l-150">
              <Label>Nombre de la practica</Label>
              <Field className="form-control" name="nombre" type="textarea" />
              {errors.nombre && touched.nombre && (
                <div className="invalid-feedback d-block">{errors.nombre}</div>
              )}
            </FormGroup>

            <FormGroup className="mb-3 error-l-75">
              <Label>Descripción</Label>
              <Field
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
              <Label>Fecha Lanzada</Label>
              <Field
                className="form-control"
                name="fechaLanzada"
                type="date"
                placeholder="DD/MM/AAAA"
              />
              {errors.fechaLanzada && touched.fechaLanzada && (
                <div className="invalid-feedback d-block">
                  {errors.fechaLanzada}
                </div>
              )}
            </FormGroup>

            <FormGroup className="mb-3 error-l-125">
              <Label>Fecha Vencimiento</Label>
              <Field
                className="form-control"
                name="fechaVencimiento"
                type="date"
                placeholder="DD/MM/AAAA"
              />
              {errors.fechaVencimiento && touched.fechaVencimiento && (
                <div className="invalid-feedback d-block">
                  {errors.fechaVencimiento}
                </div>
              )}
            </FormGroup>
            <FormGroup>
              <label className="practicas-adjuntar-button">
                Adjuntar Archivo
                <FileUploader
                  hidden
                  name="archivo"
                  randomizeFilename
                  storageRef={storage.ref(
                    'materias/' + this.props.subject.id + '/practicas/'
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

export default connect(mapStateToProps)(FormPractica);
