import React from 'react';
import { Separator } from 'components/common/CustomBootstrap';
import { Row, Button, FormGroup, Label, ModalBody, NavLink } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { editDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import IntlMessages from 'helpers/IntlMessages';
import FormPreguntas from '../preguntas-clase/form-preguntas';

class ModalCrearPreguntas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //isLoading: true,
      esPregunta: true,
      nombre: '',
      fecha_creacion: '',
      fecha_publicacion: '',
      fecha_finalizacion: '',
      descripcion: '',
      ejercicios: [],
    };
  }

  //ver si las funciones conviene declararlas acá
  render() {
    const {
      isLoading,
      idMateria,
      idClase,
      toggleModalPreguntas,
      getPreguntasDeClase,
      onPreguntasAgregadas,
    } = this.props;
    const { esPregunta } = this.state;

    return isLoading ? (
      <ModalBody>
        <div className="loading" />
      </ModalBody>
    ) : (
      <>
        <FormPreguntas
          evaluacion={this.state}
          esPregunta={esPregunta}
          idMateria={idMateria}
          idClase={idClase}
          toggleModalPreguntas={toggleModalPreguntas}
          updateLinks={getPreguntasDeClase}
          onPreguntasAgregadas={onPreguntasAgregadas}
        />
      </>
    );
  }
}

export default ModalCrearPreguntas;
