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
import { TIPO_EJERCICIO } from 'constants/tipoEjercicio';
import OpcionMultiple from 'pages/app/evaluaciones/ejercicios/opcion-multiple';
import { isEmpty } from 'helpers/Utils';
import { addDocumentWithId, addDocument } from 'helpers/Firebase-db';
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
      backdrop: 'static', // no permite cerrar el modal
      noResponde: true,
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

  onEjercicioChange = (e, numero, respuestaUnica = false) => {
    //Si selecciona una opción, lo coloco en el array

    if (respuestaUnica) {
      // pregunta de una sola opcion
      this.setState({
        respuestas: [e.indiceOpcion],
      });
    } else {
      // es multiple choice
      if (e.respuesta) {
        this.setState({
          respuestas: this.state.respuestas.concat(e.indiceOpcion),
        });
      } else {
        // si la deselecciona, lo saco del array
        this.setState({
          respuestas: this.state.respuestas.filter(
            (rta) => rta !== e.indiceOpcion
          ),
        });
      }
    }
  };

  respuestaValida = () => {
    return this.state.respuestas.length > 0;
  };

  responderPregunta = async () => {
    let obj = await this.getObjetoAGuardar();
    obj = {
      ...obj,
      respuestas: this.state.respuestas,
    };
    await this.guardarRespuesta(obj);
  };

  noSabeRespuesta = async () => {
    let obj = await this.getObjetoAGuardar();
    obj = {
      ...obj,
      respuestas: [],
    };
    await this.guardarRespuesta(obj);
  };

  getObjetoAGuardar = async () => {
    const idxRtasVerdaderas = this.state.preguntas[0].data.opciones
      .map((opc, idx) => (opc.verdadera ? idx : ''))
      .filter(String);

    return {
      idAlumno: this.props.user,
      idClase: this.state.idClase,
      idMateria: this.props.subject,
      idPregunta: this.state.preguntas[0].id,
      opcionesVerdaderas: idxRtasVerdaderas,
    };
  };

  async guardarRespuesta(obj) {
    //Guardo en la subcoleccion respuestas. El idDoc es el idUser del alumno
    // Ver de sacarlo esto en el futuro, asi se almacenan en una unica colecccion
    await addDocumentWithId(
      `clases/${this.state.idClase}/preguntas/${this.state.preguntas[0].id}/respuestas`,
      this.props.user,
      this.props.user,
      obj,
      null,
      null,
      null
    );

    // Se agrega en la colección usada para Reportes y tab de Respuestas
    await addDocument(
      'respuestasPreguntasClase',
      obj,
      this.props.user,
      null,
      null,
      'Error al agregar en Respuestas a preguntas de Clase'
    );
  }

  render() {
    const {
      preguntas,
      isLoading,
      submitted,
      tiempoPregunta,
      backdrop,
    } = this.state;
    const { isOpen, toggle, onRespuestaDeAlumno } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Modal
        className="modal-ejercicios"
        isOpen={isOpen}
        toggle={toggle}
        backdrop={backdrop}
      >
        <ModalHeader>
          Pregunta Lanzada por profesor
          <CountdownPreguntas
            remainingTime={tiempoPregunta}
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
                        respuestaUnica={pregunta.data.unicaRespuesta}
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
          <Button color="primary" onClick={this.noSabeRespuesta}>
            No sé la respuesta
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
