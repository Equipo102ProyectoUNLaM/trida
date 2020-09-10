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
import { Colxx } from 'components/common/CustomBootstrap';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import AgregarEjercicio from 'pages/app/evaluaciones/ejercicios/agregar-ejercicio';
import { Formik, Form, Field } from 'formik';
import { evaluationSchema } from 'pages/app/evaluaciones/validations';
import { FormikDatePicker } from 'containers/form-validations/FormikFields';
import { getDate } from 'helpers/Utils';
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
    if (this.state.evaluacionId) {
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
      this.setState({
        evaluacionId: this.props.idEval,
        nombre: this.props.evaluacion.nombre,
        fecha_creacion: this.props.evaluacion.fecha_creacion,
        fecha_finalizacion: getDate(
          this.props.evaluacion.fecha_finalizacion.toDate(),
          'YYYY-MM-DD, HH:mm'
        ),
        fecha_publicacion: getDate(
          this.props.evaluacion.fecha_publicacion.toDate(),
          'YYYY-MM-DD, HH:mm'
        ),
        descripcion: this.props.evaluacion.descripcion,
        ejercicios: this.props.evaluacion.ejercicios,
        creador: userName,
        isLoading: false,
      });
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
      };

      await editDocument(
        'evaluaciones',
        this.state.evaluacionId,
        obj,
        'Evaluación'
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
      console.log(err);
    }
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
              <Field className="form-control" name="nombre" />
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

            <AgregarEjercicio
              ref={(ejer) => {
                this.ejerciciosComponentRef = ejer;
              }}
              ejercicios={evaluacion.ejercicios}
            />

            <ModalFooter>
              {!evaluacion.evaluacionId && (
                <>
                  <Button color="primary" type="submit">
                    Crear Evaluación
                  </Button>
                  <Button color="secondary" onClick={onCancel}>
                    Cancelar
                  </Button>
                </>
              )}
              {evaluacion.evaluacionId && (
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
