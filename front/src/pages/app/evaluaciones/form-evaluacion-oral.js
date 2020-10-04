import React from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import { addDocument, editDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { evaluationOralSchema } from 'pages/app/evaluaciones/validations';
import { timeStamp } from 'helpers/Firebase';

class FormEvaluacionOral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      fecha_evaluacion: '',
      idMateria: '',
      isLoading: false,
    };
  }

  componentDidMount() {}

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  onOralSubmit = async (values) => {
    const { nombre, fecha_evaluacion } = values;
    if (this.props.operationType === 'add') {
      const obj = {
        nombre: nombre,
        fecha_evaluacion: timeStamp.fromDate(new Date(fecha_evaluacion)),
        idMateria: this.props.subject.id,
      };
      await addDocument(
        'evaluacionesOrales',
        obj,
        this.props.user,
        'Evaluación oral agregada',
        'Evaluación oral agregada exitosamente',
        'Error al agregar la evaluación oral'
      );
    } else {
      const obj = {
        nombre: nombre,
        fecha_evaluacion: timeStamp.fromDate(new Date(fecha_evaluacion)),
      };
      await editDocument(
        'evaluacionesOrales',
        this.props.id,
        obj,
        'Evaluación oral editada'
      );
    }

    this.props.onOralGuardado();
  };

  render() {
    const { toggleModal, textConfirm } = this.props;
    const { isLoading, nombre, fecha_evaluacion } = this.state;
    const initialValues = {
      nombre: nombre,
      fecha_evaluacion: fecha_evaluacion,
    };
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Formik
        initialValues={initialValues}
        onSubmit={this.onOralSubmit}
        validationSchema={evaluationOralSchema}
      >
        {({ errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <FormGroup className="mb-3 error-l-150">
              <Label>Título de la evaluación</Label>
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

            <FormGroup className="mb-3 error-l-125">
              <Label>Fecha Evaluación</Label>
              <Field
                autocomplete="off"
                className="form-control"
                name="fecha_evaluacion"
                type="date"
                placeholder="DD/MM/AAAA"
              />
              {errors.fecha_evaluacion && touched.fecha_evaluacion && (
                <div className="invalid-feedback d-block">
                  {errors.fecha_evaluacion}
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

export default connect(mapStateToProps)(FormEvaluacionOral);
