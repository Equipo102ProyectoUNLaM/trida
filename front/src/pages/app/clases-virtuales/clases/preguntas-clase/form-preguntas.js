import React from 'react';
import { ModalFooter, Button, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import {
  addDocument,
  deleteDocument,
  addArrayToSubCollection,
} from 'helpers/Firebase-db';
import { enviarNotificacionError } from 'helpers/Utils-ui';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import AgregarPregunta from './agregar-pregunta';
import { encriptarEjercicios } from 'helpers/EncryptionHandler';
import { isEmpty } from 'helpers/Utils';

class FormPreguntas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idClase: this.props.idClase,
      modalEditOpen: false,
      modalAddOpen: false,
      preguntas: [],
      isLoading: true,
    };
  }

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

  toggleModalWithValues = async () => {
    const valid = await this.ejerciciosComponentRef.validatePreguntas();
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
    let preguntas = this.ejerciciosComponentRef.getpreguntasRealizadas();
    const preguntasEncriptadas = encriptarEjercicios(preguntas);
    const preguntasEncriptadasAGuardar = preguntasEncriptadas.map((elem) => ({
      ...elem,
      seLanzo: false,
    }));
    console.log('preguntasEncriptadasAGuardar', preguntasEncriptadasAGuardar);
    const obj = {
      subcollection: {
        data: preguntasEncriptadasAGuardar,
      },
    };

    await addArrayToSubCollection(
      'clases',
      this.state.idClase,
      'preguntas',
      obj,
      this.props.user,
      'Preguntas',
      'Preguntas',
      'Error al crear las preguntas'
    );

    this.props.toggleModalPreguntas();
    this.props.updatePreguntas();
  };

  onEdit = async () => {
    try {
      let preguntas = this.ejerciciosComponentRef.getpreguntasRealizadas();

      //encripto preguntas para despues almacenarlas en la DB
      const preguntasEncriptadas = encriptarEjercicios(preguntas);
      const preguntasEncriptadasAGuardar = preguntasEncriptadas.map((elem) => ({
        ...elem,
        seLanzo: false,
      }));
      console.log(
        'preguntasEncriptadasAGuardar edit',
        preguntasEncriptadasAGuardar
      );
      this.state.preguntas.forEach(async (element) => {
        await deleteDocument(
          `clases/${this.state.idClase}/preguntas`,
          element.id
        );
      });

      preguntasEncriptadasAGuardar.forEach(async (element) => {
        await addDocument(
          `clases/${this.state.idClase}/preguntas`,
          element,
          this.props.user
        );
      });

      this.props.toggleModalPreguntas();
      this.props.updatePreguntas();
      return;
    } catch (err) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    }
  };

  render() {
    const { toggleModalPreguntas } = this.props;
    const { modalEditOpen, modalAddOpen, isLoading, preguntas } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <>
        <ModalBody>
          <AgregarPregunta
            ref={(ejer) => {
              this.ejerciciosComponentRef = ejer;
            }}
            preguntas={preguntas}
          />
        </ModalBody>
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
            texto="¿Estás seguro de editar las preguntas?"
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
            texto="¿Estás seguro de crear las preguntas?"
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
