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
        fecha_finalizacion: values.fecha_finalizacion.format('YYYY-MM-DD'),
        fecha_publicacion: values.fecha_publicacion.format('YYYY-MM-DD'),
        descripcion: values.descripcion,
        nombre: values.nombre,
        modalEditOpen: !this.state.modalEditOpen,
      });
    } else {
      this.setState({
        fecha_finalizacion: values.fecha_finalizacion.format('YYYY-MM-DD'),
        fecha_publicacion: values.fecha_publicacion.format('YYYY-MM-DD'),
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
        fecha_finalizacion: getDate(this.props.evaluacion.fecha_finalizacion),
        fecha_publicacion: getDate(this.props.evaluacion.fecha_publicacion),
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
    let ejercicios = this.ejerciciosComponentRef.getEjerciciosSeleccionados();

    const obj = {
      nombre: this.state.nombre,
      fecha_finalizacion: this.state.fecha_finalizacion,
      fecha_publicacion: this.state.fecha_publicacion,
      descripcion: this.state.descripcion,
      idMateria: this.props.idMateria,
      activo: true,
      subcollection: {
        data: ejercicios,
      },
    };

    await addDocumentWithSubcollection(
      'evaluaciones',
      obj,
      this.props.user,
      'Evaluación',
      'ejercicios',
      'Ejercicios'
    );

    this.props.onEvaluacionAgregada();
  };

  onEdit = async () => {
    try {
      let ejercicios = this.ejerciciosComponentRef.getEjerciciosSeleccionados();

      const obj = {
        nombre: this.state.nombre,
        fecha_finalizacion: this.state.fecha_finalizacion,
        fecha_publicacion: this.state.fecha_publicacion,
        descripcion: this.state.descripcion,
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

      ejercicios.forEach(async (element) => {
        await addDocument(
          `evaluaciones/${this.state.evaluacionId}/ejercicios`,
          element,
          this.props.user
        );
      });

      this.toggleModal();
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
                  <Label>Fecha de Publicación</Label>
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
                  <Label>Fecha de Finalización</Label>
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

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(FormEvaluacion);
