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
import { formPracticaSchema } from './validations';
import { storage } from 'helpers/Firebase';
import { FormikDatePicker } from 'containers/form-validations/FormikFields';
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
        fechaLanzada: fechaLanzada.toDate(),
        fechaVencimiento: fechaVencimiento.toDate(),
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

      //const url = await subirArchivoAStorage(path, file, uuid);
      this.setState({ file: file });
    };

    reader.readAsDataURL(file);
  };
  /* ************ */

  onPracticaSubmit = async (values) => {
    const { nombre, descripcion, fechaLanzada, fechaVencimiento } = values;
    this.setState({ isLoading: true });
    const uuid = createUUID();
    const path = 'materias/' + this.props.subject.id + '/practicas/';
    const url = await subirArchivoAStorage(path, this.state.file, uuid);

    if (this.props.operationType === 'add') {
      const obj = {
        nombre: nombre,
        fechaLanzada: fechaLanzada,
        descripcion: descripcion,
        fechaVencimiento: fechaVencimiento,
        idMateria: this.props.subject.id,
        idArchivo: uuid,
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
        idArchivo: uuid,
        estado: 'pendiente',
      };
      await editDocument('practicas', this.props.id, obj, 'Práctica editada');
    }
    this.setState({ isLoading: false });

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
        {({ values, setFieldValue, setFieldTouched, errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <FormGroup className="mb-3 error-l-150">
              <Label>Nombre de la practica</Label>
              <Field
                className="form-control"
                name="nombre"
                type="textarea"
                autoComplete="off"
              />
              {errors.nombre && touched.nombre && (
                <div className="invalid-feedback d-block">{errors.nombre}</div>
              )}
            </FormGroup>

            <FormGroup className="mb-3 error-l-75">
              <Label>Descripción</Label>
              <Field
                autoComplete="off"
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
              <FormikDatePicker
                practicaPicker
                name="fechaLanzada"
                value={values.fechaLanzada}
                placeholder="Ingrese la fecha de lanzamiento"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
              {errors.fechaLanzada && touched.fechaLanzada && (
                <div className="invalid-feedback d-block">
                  {errors.fechaLanzada}
                </div>
              )}
            </FormGroup>

            <FormGroup className="mb-3 error-l-125">
              <Label>Fecha Vencimiento</Label>
              <FormikDatePicker
                practicaPicker
                name="fechaVencimiento"
                value={values.fechaVencimiento}
                placeholder="Ingrese la fecha de vencimiento"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
              {errors.fechaVencimiento && touched.fechaVencimiento && (
                <div className="invalid-feedback d-block">
                  {errors.fechaVencimiento}
                </div>
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

              {this.props.submitted && !this.state.file ? (
                <div className="invalid-feedback d-block">
                  Adjuntar un archivo en una extensión válida
                </div>
              ) : null}
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

export default connect(mapStateToProps)(FormPractica);
