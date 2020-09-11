import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label, Row } from 'reactstrap';
import { connect } from 'react-redux';
import {
  addDocument,
  editDocument,
  deleteDocument,
  addArrayToSubCollection,
} from 'helpers/Firebase-db';
import { Colxx } from 'components/common/CustomBootstrap';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import AgregarPregunta from './agregar-pregunta';
import { Formik, Form, Field } from 'formik';
import { evaluationSchema } from 'pages/app/evaluaciones/validations';
import { FormikDatePicker } from 'containers/form-validations/FormikFields';
import { getDate, getDateTimeStringFromDate } from 'helpers/Utils';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import { encriptarEjercicios } from 'handlers/EncryptionHandler';
import { timeStamp } from 'helpers/Firebase';
import { isEmpty } from 'helpers/Utils';

class FormPreguntas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idClase: this.props.idClase,
      creador: '',
      modalEditOpen: false,
      modalAddOpen: false,
      preguntas: [],
      isLoading: true,
    };
  }
  //todo lo que sea idClase seguro se reemplaza por preguntas
  toggleModalConfirmacion = () => {
    if (!isEmpty(this.state.preguntas)) {
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
    console.log('valid', valid);
    if (!valid) return;
    if (!isEmpty(this.state.preguntas)) {
      this.setState({
        modalEditOpen: !this.state.modalEditOpen,
      });
    } else {
      this.setState({
        modalAddOpen: !this.state.modalAddOpen,
      });
    }
  };

  componentDidMount() {
    if (this.props.preguntas) {
      this.setState({ preguntas: this.props.preguntas });
    }
    this.setState({
      isLoading: false,
    });
  }

  onSubmit = async () => {
    let preguntas = this.ejerciciosComponentRef.getEjerciciosSeleccionados();
    const preguntasEncriptadas = encriptarEjercicios(preguntas);
    const obj = {
      subcollection: {
        data: preguntasEncriptadas,
      },
    };
    console.log(obj);
    await addArrayToSubCollection(
      'clases',
      this.state.idClase,
      'preguntas',
      obj,
      this.props.user,
      'Preguntas creadas!',
      'Preguntas creadas exitosamente',
      'Error al crear las preguntas'
    );

    this.props.toggleModalPreguntas();
    this.props.updatePreguntas();
  };

  onEdit = async () => {
    try {
      let preguntas = this.ejerciciosComponentRef.getEjerciciosSeleccionados();

      //encripto preguntas
      const preguntasEncriptadas = encriptarEjercicios(preguntas);

      /*    Creo que no iria, pq no necesito actualizar la clase   
      await editDocument(
        'evaluaciones',
        this.state.preguntaId,
        obj,
        'Evaluación'
      ); */

      this.state.preguntas.forEach(async (element) => {
        await deleteDocument(
          `clases/${this.state.idClase}/preguntas`,
          element.id
        );
      });

      preguntasEncriptadas.forEach(async (element) => {
        await addDocument(
          `clases/${this.state.idClase}/preguntas`,
          element,
          this.props.user
        );
      });

      this.props.toggleModalPreguntas();
      this.props.updatePreguntas();

      /*       this.toggleModalConfirmacion();
      this.props.onEvaluacionEditada(); */
      return;
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { toggleModalPreguntas } = this.props;
    const { modalEditOpen, modalAddOpen, isLoading, preguntas } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <>
        <AgregarPregunta
          ref={(ejer) => {
            this.ejerciciosComponentRef = ejer;
          }}
          preguntas={preguntas}
        />

        <ModalFooter>
          {isEmpty(preguntas) && (
            <>
              <Button color="primary" onClick={this.toggleModalWithValues}>
                Crear Preguntas
              </Button>
              <Button color="secondary" onClick={toggleModalPreguntas}>
                Cancelar
              </Button>
            </>
          )}
          {!isEmpty(preguntas) && (
            <>
              <Button color="primary" onClick={this.toggleModalWithValues}>
                Guardar Preguntas
              </Button>
              <Button color="secondary" onClick={toggleModalPreguntas}>
                Cancelar
              </Button>
            </>
          )}
        </ModalFooter>
        {modalEditOpen && (
          <ModalConfirmacion
            texto="¿Está seguro de que desea editar las preguntas?"
            titulo="Guardar Preguntas"
            buttonPrimary="Aceptar"
            buttonSecondary="Cancelar"
            toggle={this.toggleModalConfirmacion}
            isOpen={modalEditOpen}
            onConfirm={this.onEdit}
          />
        )}
        {modalAddOpen && (
          <ModalConfirmacion
            texto="¿Está seguro de que desea crear las preguntas?"
            titulo="Crear Preguntas"
            buttonPrimary="Aceptar"
            buttonSecondary="Cancelar"
            toggle={this.toggleModalConfirmacion}
            isOpen={modalAddOpen}
            onConfirm={this.onSubmit}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(FormPreguntas);
