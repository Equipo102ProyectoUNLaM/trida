import React from 'react';
import { ModalBody } from 'reactstrap';
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
      toggleModalPreguntas,
      updatePreguntas,
    } = this.props;

    return isLoading ? (
      <ModalBody>
        <div className="loading" />
      </ModalBody>
    ) : (
      <>
        <FormPreguntas
          preguntas={preguntas}
          idClase={idClase}
          toggleModalPreguntas={toggleModalPreguntas}
          updatePreguntas={updatePreguntas}
        />
      </>
    );
  }
}

export default ModalCrearPreguntas;
