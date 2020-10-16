import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label, Row } from 'reactstrap';
import { connect } from 'react-redux';
import {
  addDocument,
  editDocument,
  deleteDocument,
  addDocumentWithSubcollection,
  getUsernameById,
} from 'helpers/Firebase-db';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import AgregarEjercicio from 'pages/app/evaluaciones/ejercicios/agregar-ejercicio';
import { Formik, Form, Field } from 'formik';
import { evaluationSchema } from 'pages/app/evaluaciones/validations';
import { FormikDatePicker } from 'containers/form-validations/FormikFields';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import { encriptarEjercicios } from 'handlers/EncryptionHandler';
import { timeStamp } from 'helpers/Firebase';
import { TIPO_EJERCICIO } from 'enumerators/tipoEjercicio';
import { subirArchivoAStorage } from 'helpers/Firebase-storage';
import { generateId } from 'helpers/Firebase-db';

class FormEvaluacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      evaluacionId: '',
      nombre: '',
      fecha_creacion: '',
      fecha_finalizacion: null,
      fecha_publicacion: null,
      descripcion: '',
      creador: '',
      modalEditOpen: false,
      modalAddOpen: false,
      ejercicios: [],
      sin_salir_de_ventana: false,
      sin_capturas: false,
      isLoading: true,
    };
  }

  toggleModal = () => {
    if (this.state.evaluacionId) {
      this.setState({
        modalEditOpen: !this.state.modalEditOpen,
      });
    } else {
      this.setState({
        modalAddOpen: !this.state.modalAddOpen,
      });
    }
  };

  toggleModalWithValues = async (values) => {
    const valid = await this.ejerciciosComponentRef.validateEjercicios();
    if (!valid) return;
    if (this.state.evaluacionId && !this.props.evaluacionImportada) {
      this.setState({
        fecha_finalizacion: values.fecha_finalizacion,
        fecha_publicacion: values.fecha_publicacion,
        descripcion: values.descripcion,
        nombre: values.nombre,
        modalEditOpen: !this.state.modalEditOpen,
      });
    } else {
      this.setState({
        fecha_finalizacion: values.fecha_finalizacion,
        fecha_publicacion: values.fecha_publicacion,
        descripcion: values.descripcion,
        nombre: values.nombre,
        modalAddOpen: !this.state.modalAddOpen,
      });
    }
  };

  async componentDidMount() {
    if (this.props.idEval) {
      const userName = await getUsernameById(this.props.user);
      if (this.props.evaluacionImportada) {
        this.setState({
          evaluacionId: this.props.idEval,
          nombre: this.props.evaluacion.nombre,
          fecha_creacion: this.props.evaluacion.fecha_creacion,
          descripcion: this.props.evaluacion.descripcion,
          ejercicios: this.props.evaluacion.ejercicios,
          creador: userName,
          isLoading: false,
          sin_salir_de_ventana: this.props.evaluacion.sin_salir_de_ventana,
          sin_capturas: this.props.evaluacion.sin_capturas,
        });
      } else {
        this.setState({
          evaluacionId: this.props.idEval,
          nombre: this.props.evaluacion.nombre,
          fecha_creacion: this.props.evaluacion.fecha_creacion,
          fecha_finalizacion: this.props.evaluacion.fecha_finalizacion.toDate(),
          fecha_publicacion: this.props.evaluacion.fecha_publicacion.toDate(),
          descripcion: this.props.evaluacion.descripcion,
          ejercicios: this.props.evaluacion.ejercicios,
          sin_capturas: this.props.evaluacion.sin_capturas,
          sin_salir_de_ventana: this.props.evaluacion.sin_salir_de_ventana,
          creador: userName,
          isLoading: false,
        });
      }
    } else {
      this.setState({ isLoading: false });
    }
  }

  onSubmit = async () => {
    this.setState({
      isLoading: true,
    });
    let ejercicios = this.ejerciciosComponentRef.getEjerciciosSeleccionados();
    const idEval = await generateId(
      `materias/${this.props.subject.id}/evaluaciones/`
    );
    let ejerciciosConUrl = await this.subirImagenesAStorage(ejercicios, idEval);
    const ejerciciosEncriptados = encriptarEjercicios(ejerciciosConUrl);
    const obj = {
      nombre: CryptoJS.AES.encrypt(this.state.nombre, secretKey).toString(),
      fecha_finalizacion: timeStamp.fromDate(
        new Date(this.state.fecha_finalizacion)
      ),
      fecha_publicacion: timeStamp.fromDate(
        new Date(this.state.fecha_publicacion)
      ),
      descripcion: CryptoJS.AES.encrypt(
        this.state.descripcion,
        secretKey
      ).toString(),
      sin_capturas: CryptoJS.AES.encrypt(
        this.state.sin_capturas.toString(),
        secretKey
      ).toString(),
      sin_salir_de_ventana: CryptoJS.AES.encrypt(
        this.state.sin_salir_de_ventana.toString(),
        secretKey
      ).toString(),
      idMateria: this.props.idMateria,
      activo: true,
      subcollection: {
        data: ejerciciosEncriptados,
      },
    };

    await addDocumentWithSubcollection(
      'evaluaciones',
      obj,
      this.props.user,
      'Evaluación',
      'ejercicios',
      'Ejercicios',
      idEval
    );
    this.setState({
      isLoading: false,
    });
    this.props.onEvaluacionAgregada();
  };

  subirImagenesAStorage = async (ejercicios, idEval) => {
    let ejerConUrl = ejercicios;

    for (const ej of ejerConUrl) {
      if (ej.tipo === TIPO_EJERCICIO.opcion_multiple_imagen) {
        let i = 0;
        for (let opcion of ej.opciones) {
          const path = `materias/${this.props.subject.id}/evaluaciones/${idEval}`;
          let url = opcion.file
            ? await subirArchivoAStorage(path, opcion.file)
            : opcion.opcion;
          ej.opciones[i] = {
            opcion: url,
            verdadera: opcion.verdadera,
          };
          i++;
        }
      }
    }
    return ejerConUrl;
  };

  onEdit = async () => {
    try {
      this.setState({
        isLoading: true,
      });
      let ejercicios = this.ejerciciosComponentRef.getEjerciciosSeleccionados();
      let ejerciciosConUrl = await this.subirImagenesAStorage(
        ejercicios,
        this.state.evaluacionId
      );
      const ejerciciosEncriptados = encriptarEjercicios(ejerciciosConUrl);
      const obj = {
        nombre: CryptoJS.AES.encrypt(this.state.nombre, secretKey).toString(),
        fecha_finalizacion: timeStamp.fromDate(
          new Date(this.state.fecha_finalizacion)
        ),
        fecha_publicacion: timeStamp.fromDate(
          new Date(this.state.fecha_publicacion)
        ),
        descripcion: CryptoJS.AES.encrypt(
          this.state.descripcion,
          secretKey
        ).toString(),
        sin_capturas: CryptoJS.AES.encrypt(
          this.state.sin_capturas.toString(),
          secretKey
        ).toString(),
        sin_salir_de_ventana: CryptoJS.AES.encrypt(
          this.state.sin_salir_de_ventana.toString(),
          secretKey
        ).toString(),
      };

      await editDocument(
        'evaluaciones',
        this.state.evaluacionId,
        obj,
        'Evaluación editada'
      );

      this.state.ejercicios.forEach(async (element) => {
        await deleteDocument(
          `evaluaciones/${this.state.evaluacionId}/ejercicios`,
          element.id
        );
      });

      ejerciciosEncriptados.forEach(async (element) => {
        await addDocument(
          `evaluaciones/${this.state.evaluacionId}/ejercicios`,
          element,
          this.props.user
        );
      });

      this.toggleModal();
      this.setState({
        isLoading: false,
      });
      this.props.onEvaluacionEditada();
      return;
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    }
  };

  handleChange = (event) => {
    const { checked, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: checked });
  };

  render() {
    const { onCancel, evaluacion } = this.props;
    const {
      modalEditOpen,
      modalAddOpen,
      nombre,
      fecha_finalizacion,
      fecha_publicacion,
      descripcion,
      isLoading,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Formik
        initialValues={{
          nombre: nombre,
          descripcion: descripcion,
          fecha_finalizacion: fecha_finalizacion,
          fecha_publicacion: fecha_publicacion,
        }}
        validationSchema={evaluationSchema}
        onSubmit={this.toggleModalWithValues}
      >
        {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right" autoComplete="off">
            <FormGroup className="mb-3 error-l-150">
              <Label>Nombre de la evaluacion</Label>
              <Field
                className="form-control"
                name="nombre"
                autoComplete="off"
              />
              {errors.nombre && touched.nombre ? (
                <div className="invalid-feedback d-block">{errors.nombre}</div>
              ) : null}
            </FormGroup>
            {evaluacion.fecha_creacion && (
              <Row>
                <Colxx xxs="6">
                  <FormGroup className="mb-3">
                    <Label>Fecha de Creación</Label>
                    <Input
                      name="fecha_creacion"
                      readOnly
                      value={evaluacion.fecha_creacion}
                    />
                  </FormGroup>
                </Colxx>
                <Colxx xxs="6">
                  <FormGroup className="mb-3">
                    <Label>Creada por</Label>
                    <Input name="autor" readOnly value={this.state.creador} />
                  </FormGroup>
                </Colxx>
              </Row>
            )}

            <Row>
              <Colxx xxs="6">
                <FormGroup className="mb-3 error-l-150">
                  <Label>Fecha y Hora de Publicación</Label>
                  <FormikDatePicker
                    name="fecha_publicacion"
                    value={values.fecha_publicacion}
                    placeholder="Ingrese la fecha de publicación de la evaluación"
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                  />
                  {errors.fecha_publicacion && touched.fecha_publicacion ? (
                    <div className="invalid-feedback d-block">
                      {errors.fecha_publicacion}
                    </div>
                  ) : null}
                </FormGroup>
              </Colxx>
              <Colxx xxs="6">
                <FormGroup className="mb-3 error-l-150">
                  <Label>Fecha y Hora de Finalización</Label>
                  <FormikDatePicker
                    name="fecha_finalizacion"
                    value={values.fecha_finalizacion}
                    placeholder="Ingrese la fecha de finalización de la evaluación"
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                  />
                  {errors.fecha_finalizacion && touched.fecha_finalizacion ? (
                    <div className="invalid-feedback d-block">
                      {errors.fecha_finalizacion}
                    </div>
                  ) : null}
                </FormGroup>
              </Colxx>
            </Row>

            <FormGroup className="mb-3 error-l-75">
              <Label>Descripción</Label>
              <Field
                autoComplete="off"
                className="form-control"
                name="descripcion"
                component="textarea"
              />
              {errors.descripcion && touched.descripcion ? (
                <div className="invalid-feedback d-block">
                  {errors.descripcion}
                </div>
              ) : null}
            </FormGroup>
            <FormGroup className="mb-3 mt-4">
              <h4>Características especiales</h4>
              <Row className="mt-4">
                <Colxx xxs="12" xs="6" sm="6" md="4">
                  <Input
                    name="sin_capturas"
                    className="margin-auto checkbox"
                    type="checkbox"
                    onChange={this.handleChange}
                    checked={this.state.sin_capturas}
                  />
                  <Label className="ml-1">
                    No permitir capturas de pantalla
                  </Label>
                </Colxx>
                <Colxx xxs="12" xs="6" sm="6" md="4">
                  <Input
                    name="sin_salir_de_ventana"
                    className="margin-auto checkbox"
                    type="checkbox"
                    onChange={this.handleChange}
                    checked={this.state.sin_salir_de_ventana}
                  />
                  <Label className="ml-1">
                    No permitir salir de la ventana
                  </Label>
                </Colxx>
              </Row>
            </FormGroup>
            <Separator className="mb-5" />
            <AgregarEjercicio
              ref={(ejer) => {
                this.ejerciciosComponentRef = ejer;
              }}
              ejercicios={evaluacion.ejercicios}
            />

            <ModalFooter>
              {(!evaluacion.evaluacionId || this.props.evaluacionImportada) && (
                <>
                  <Button color="primary" type="submit">
                    Crear Evaluación
                  </Button>
                  <Button color="secondary" onClick={onCancel}>
                    Cancelar
                  </Button>
                </>
              )}
              {evaluacion.evaluacionId && !this.props.evaluacionImportada && (
                <>
                  <Button color="primary" type="submit">
                    Guardar Evaluación
                  </Button>
                  <Button color="secondary" onClick={onCancel}>
                    Cancelar
                  </Button>
                </>
              )}
            </ModalFooter>
            {modalEditOpen && (
              <ModalConfirmacion
                texto="¿Está seguro de que desea editar la evaluación?"
                titulo="Guardar Evaluación"
                buttonPrimary="Aceptar"
                buttonSecondary="Cancelar"
                toggle={this.toggleModal}
                isOpen={modalEditOpen}
                onConfirm={this.onEdit}
              />
            )}
            {modalAddOpen && (
              <ModalConfirmacion
                texto="¿Está seguro de que desea crear la evaluación?"
                titulo="Crear Evaluación"
                buttonPrimary="Aceptar"
                buttonSecondary="Cancelar"
                toggle={this.toggleModal}
                isOpen={modalAddOpen}
                onConfirm={this.onSubmit}
              />
            )}
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

export default connect(mapStateToProps)(FormEvaluacion);
