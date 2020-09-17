import React, { Component } from 'react';
import DataListView from 'containers/pages/DataListView';
import ModalGrande from 'containers/pages/ModalGrande';
import { editDocument, getCollectionOnSnapshot } from 'helpers/Firebase-db';
import { Button, Row, ModalFooter } from 'reactstrap';

class PreguntasLanzadasAAlumnos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preguntas: [],
      preguntaALanzar: null,
      preguntasOnSnapshot: [],
      isLoading: true,
      idClase: this.props.idClase, //
      modalPreguntasOpen: false,
    };
  }

  componentDidMount() {
    this.setState({
      preguntas: this.props.preguntas,
      isLoading: false,
    });
  }

  onSelectPregunta = (idPregunta) => {
    this.setState({
      preguntaALanzar: idPregunta,
    });
  };

  closeModalPreguntas = () => {
    this.setpreguntaALanzar(null);
    this.props.toggleModalPreguntas();
  };

  onLanzarPregunta = () => {
    editDocument(
      `clases/${this.state.idClase}/preguntas`,
      this.state.preguntaALanzar,
      {
        lanzada: true,
      }
    );
    this.onSelectPregunta(null);
    this.props.toggleModalPreguntas();
  };

  render() {
    const {
      preguntas,
      preguntaALanzar,
      modalPreguntasOpen,
      isLoading,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <ModalGrande
        modalOpen={modalPreguntasOpen}
        toggleModal={this.props.toggleModalPreguntas()}
        text="Preguntas de la Clase"
      >
        {preguntas.map((pregunta) => {
          const consignaPregunta = pregunta.data.consigna;
          return (
            <DataListView
              key={pregunta.id}
              id={pregunta.id}
              title={consignaPregunta}
              modalLanzarPreguntas={true}
              preguntaALanzar={preguntaALanzar}
              onSelectPregunta={this.onSelectPregunta}
            />
          );
        })}
        <ModalFooter>
          <Button
            color="primary"
            disabled={!preguntaALanzar}
            onClick={this.onLanzarPregunta}
          >
            Lanzar Pregunta
          </Button>
          <Button color="secondary" onClick={this.closeModalPreguntas}>
            Cancelar
          </Button>
        </ModalFooter>
      </ModalGrande>
    );
  }
}

export default PreguntasLanzadasAAlumnos;
