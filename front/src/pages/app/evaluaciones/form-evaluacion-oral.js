import React from 'react';
import { connect } from 'react-redux';
import { ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import { addDocument, editDocument } from 'helpers/Firebase-db';
import { Formik, Form, Field } from 'formik';
import { FormikDatePicker } from 'containers/form-validations/FormikFields';
import { evaluationOralSchema } from 'pages/app/evaluaciones/validations';
import { timeStamp } from 'helpers/Firebase';
import Select from 'react-select';

class FormEvaluacionOral extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      fecha_evaluacion: '',
      idMateria: '',
      isLoading: false,
      usuariosDelSelect: this.props.datosUsuarios,
      selectedOptions: [],
    };
  }

  componentDidMount() {}

  componentWillUnmount() {
    this.setState({
      usuariosDelSelect: [],
    });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleChangeMulti = (selectedOptions) => {
    this.setState({ selectedOptions });
  };

  onOralSubmit = async (values) => {
    const { nombre, fecha_evaluacion } = values;

    const integrantes = this.state.selectedOptions.map(({ value }) => value);

    if (this.props.operationType === 'add') {
      const obj = {
        nombre: nombre,
        fecha_evaluacion: timeStamp.fromDate(new Date(fecha_evaluacion)),
        idMateria: this.props.subject.id,
        integrantes: integrantes,
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
        integrantes: integrantes,
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

  disableEnviarButton() {
    return this.state.selectedOptions.length === 0;
  }

  render() {
    const { toggleModal, textConfirm } = this.props;
    const {
      isLoading,
      nombre,
      fecha_evaluacion,
      usuariosDelSelect,
      selectedOptions,
    } = this.state;
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
        {({ setFieldValue, setFieldTouched, values, errors, touched }) => (
          <Form className="av-tooltip tooltip-label-right">
            <FormGroup className="mb-3 error-l-150">
              <Label>Título de la evaluación</Label>
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

            <FormGroup className="mb-3 error-l-125">
              <Label>Fecha Evaluación</Label>
              {/* <Field
                autoComplete="off"
                className="form-control"
                name="fecha_evaluacion"
                type="date"
                placeholder="DD/MM/AAAA"
              /> */}
              <FormikDatePicker
                name="fecha_evaluacion"
                value={values.fecha_evaluacion}
                placeholder="Ingrese la fecha de la evaluación"
                onChange={setFieldValue}
                onBlur={setFieldTouched}
              />
              {errors.fecha_evaluacion && touched.fecha_evaluacion ? (
                <div className="invalid-feedback d-block">
                  {errors.fecha_evaluacion}
                </div>
              ) : null}
            </FormGroup>

            <Label>Integrantes</Label>
            <Select
              className="react-select"
              classNamePrefix="react-select"
              isMulti
              placeholder="Seleccione los integrantes"
              name="select_usuarios"
              value={selectedOptions}
              onChange={this.handleChangeMulti}
              options={usuariosDelSelect}
              required
            />

            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                disabled={this.disableEnviarButton()}
              >
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
