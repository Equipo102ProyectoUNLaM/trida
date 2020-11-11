import React from 'react';
import { ModalBody, Modal, ModalHeader } from 'reactstrap';
import FormPreguntas from '../preguntas-clase/form-preguntas';

class ModalCrearPreguntas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      esPregunta: true,
      ejercicios: [],
    };
  }

  render() {
    const {
      isLoading,
      idClase,
      preguntas,
      modalOpen,
      toggleModalPreguntas,
      updatePreguntas,
    } = this.props;

    return isLoading ? (
      <ModalBody>
        <div className="loading" />
      </ModalBody>
    ) : (
      <>
        <Modal isOpen={modalOpen} size="lg" toggle={toggleModalPreguntas}>
          <ModalHeader toggle={toggleModalPreguntas}>
            Preguntas de la clase
          </ModalHeader>

          <FormPreguntas
            preguntas={preguntas}
            idClase={idClase}
            toggleModalPreguntas={toggleModalPreguntas}
            updatePreguntas={updatePreguntas}
          />
        </Modal>
      </>
    );
  }
}

export default ModalCrearPreguntas;
