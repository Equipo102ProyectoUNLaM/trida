import React, { Component } from 'react';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { TIPO_EJERCICIO } from 'enumerators/tipoEjercicio';
import OpcionMultiple from 'pages/app/evaluaciones/ejercicios/opcion-multiple';
import { isEmpty } from 'helpers/Utils';
import { addDocument, addDocumentWithId } from 'helpers/Firebase-db';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import CountdownPreguntas from 'components/common/CountdownPreguntas';

class ContestarPregunta extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preguntas: [],
      respuestas: [],
      isLoading: true,
      submitted: false,
      idClase: this.props.idClase,
    };
  }

  componentDidMount() {
    if (!isEmpty(this.props.preguntas)) {
      this.setState({ preguntas: this.props.preguntas });
    }
    this.setState({
      tiempoPregunta: this.props.tiempoPreguntaOnSnapshot,
      isLoading: false,
    });
  }

  onEjercicioChange = (e, numero) => {
    //Si selecciona una opción, lo coloco en el array
    if (e.respuesta) {
      this.setState(
        {
          respuestas: this.state.respuestas.concat(e.indiceOpcion),
        },
        this.log
      );
    } else {
      // si la deselecciona, lo saco del array
      this.setState({
        respuestas: this.state.respuestas.filter(
          (rta) => rta !== e.indiceOpcion
        ),
      });
    }
  };

  respuestaValida = () => {
    return this.state.respuestas.length > 0;
  };

  responderPregunta = async () => {
    const obj = {
      idAlumno: this.props.user,
      respuestas: this.state.respuestas,
    };
    if (this.respuestaValida()) {
      //Guardo en la subcoleccion respuestas. El idDoc es el idUser del alumno
      await addDocumentWithId(
        `clases/${this.state.idClase}/preguntas/${this.state.preguntas[0].id}/respuestas`,
        this.props.user,
        obj,
        'Pregunta'
      );
      this.props.toggle();
    }
  };

  render() {
    const {
      preguntas,
      isLoading,
      submitted,
      respuestas,
      tiempoPregunta,
    } = this.state;
    const {
      isOpen,
      toggle,
      onRespuestaDeAlumno,
      tiempoPreguntaOnSnapshot,
    } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Modal className="modal-ejercicios" isOpen={isOpen} toggle={toggle}>
        <ModalHeader>
          Pregunta Lanzada por profesor
          <CountdownPreguntas
            end={tiempoPregunta}
            onFinish={onRespuestaDeAlumno}
          />
        </ModalHeader>
        <ModalBody className="modal-ejercicios-body">
          {preguntas.map((pregunta, index) => (
            <Row className="mb-4" key={index + 'ejer'}>
              <Colxx xxs="12">
                <Card>
                  <CardBody>
                    <CardTitle>
                      <h5 className="mb-4">
                        Pregunta N°{pregunta.data.numero}
                      </h5>
                    </CardTitle>
                    {pregunta.data.tipo === TIPO_EJERCICIO.opcion_multiple && (
                      <OpcionMultiple
                        ejercicioId={index}
                        value={pregunta.data}
                        submitted={submitted}
                        resolve={true}
                        onEjercicioChange={this.onEjercicioChange}
                      />
                    )}
                  </CardBody>
                </Card>
              </Colxx>
            </Row>
          ))}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            disabled={!this.respuestaValida()}
            onClick={this.responderPregunta}
          >
            Contestar Pregunta
          </Button>
          <Button color="primary" onClick={toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject } = seleccionCurso;
  const { user } = authUser;

  return { subject, user };
};

export default injectIntl(connect(mapStateToProps)(ContestarPregunta));
