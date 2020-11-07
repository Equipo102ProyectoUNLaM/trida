import React from 'react';
import { Row, Button, FormGroup, Card, CardBody } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { TIPO_EJERCICIO } from 'enumerators/tipoEjercicio';
import OpcionMultiple from 'pages/app/evaluaciones/ejercicios/opcion-multiple';
import { isEmpty } from 'helpers/Utils';

class AgregarPregunta extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preguntasRealizadas: [
        {
          nombre: '',
          tipo: '',
          numero: 1,
        },
      ],
      modalEditOpen: false,
      modalAddOpen: false,
      consigna: '',
      opciones: [],
      cant: 1,
      submitted: false,
      isLoading: true,
      unicaRespuesta: false,
    };
  }

  componentDidMount() {
    if (!isEmpty(this.props.preguntas)) {
      let preguntas = [];
      for (const doc of this.props.preguntas) {
        preguntas.push(doc.data);
      }
      this.setState({
        preguntasRealizadas: preguntas,
        cant: preguntas.length,
      });
    }
    this.setState({
      isLoading: false,
    });
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: value });
  };

  toggleEditModal = () => {
    this.setState({
      modalEditOpen: !this.state.modalEditOpen,
    });
  };

  toggleAddModal = () => {
    this.setState({
      modalAddOpen: !this.state.modalAddOpen,
    });
  };

  validatePreguntas = () => {
    let valid = true;
    if (this.state.preguntasRealizadas.length === 0) return valid;
    this.setState({ submitted: true });
    for (const preg of this.state.preguntasRealizadas) {
      if (!preg.tipo) {
        preg.tipo = TIPO_EJERCICIO.opcion_multiple;
      }

      switch (preg.tipo) {
        case TIPO_EJERCICIO.opcion_multiple:
          if (!preg.opciones || preg.opciones.length === 0) {
            valid = false;
            break;
          }
          if (!preg.consigna) valid = false; //Sin consigna
          if (!preg.opciones.find((x) => x.verdadera === true)) valid = false; //Ninguna verdadera
          if (preg.opciones.find((x) => !x.opcion)) valid = false; //Alguna sin cargar opcion
          break;
        default:
          break;
      }
    }
    return valid;
  };

  getpreguntasRealizadas = () => {
    return this.state.preguntasRealizadas;
  };

  onPreguntaChange = (e, index) => {
    let list = this.state.preguntasRealizadas;
    let ej = list[index];
    list[index] = Object.assign(ej, e);
    this.setState({
      preguntasRealizadas: list,
    });
  };

  handleAddPregunta = (e) => {
    let preg = this.state.preguntasRealizadas;
    let num = this.state.cant + 1;
    preg.push({ nombre: '', tipo: '', numero: num, unicaRespuesta: false });
    this.setState({
      preguntasRealizadas: preg,
      cant: num,
      unicaRespuesta: false,
      submitted: false,
    });
  };

  handleAddPreguntaUnicaResp = (e) => {
    let preg = this.state.preguntasRealizadas;
    let num = this.state.cant + 1;
    preg.push({ nombre: '', tipo: '', numero: num, unicaRespuesta: true });
    this.setState({
      preguntasRealizadas: preg,
      cant: num,
      unicaRespuesta: true,
      submitted: false,
    });
  };

  eliminarPregunta = (index) => {
    let preguntas = this.state.preguntasRealizadas;
    const numeroPreg = preguntas[index].numero;
    for (let index = numeroPreg - 1; index < preguntas.length; index++) {
      preguntas[index].numero = preguntas[index].numero - 1;
    }
    preguntas.splice(index, 1);
    let oldCant = this.state.cant;
    this.setState({
      preguntasRealizadas: preguntas,
      cant: oldCant - 1,
      submitted: false,
    });
  };

  handleSelectChange = (event, index) => {
    let preguntas = this.state.preguntasRealizadas;
    preguntas[index].nombre = event.label;
    preguntas[index].tipo = event.value;
    this.setState({
      preguntasRealizadas: preguntas,
    });
  };

  render() {
    const {
      preguntasRealizadas,
      submitted,
      isLoading,
      unicaRespuesta,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <FormGroup className="mb-3">
        {preguntasRealizadas.map((pregunta, index) => (
          <Row key={'row ' + index}>
            <Colxx xxs="12">
              <Row>
                <Colxx xxs="12">
                  <Card className="mb-4">
                    <CardBody>
                      <Row>
                        <Colxx className="text-left" xxs="11">
                          <div key={index}>
                            <h6 className="mb-4">
                              Pregunta N°{pregunta.numero}
                            </h6>
                            <OpcionMultiple
                              ejercicioId={index}
                              value={pregunta}
                              respuestaUnica={unicaRespuesta}
                              submitted={submitted}
                              preview={false}
                              onEjercicioChange={this.onPreguntaChange}
                            />
                          </div>
                        </Colxx>
                        <Colxx xxs="1" className="icon-container">
                          <div
                            className="margin-auto"
                            style={{ textAlign: 'center' }}
                          >
                            <div
                              className="glyph-icon simple-icon-trash delete-icon"
                              onClick={() => this.eliminarPregunta(index)}
                            />
                            <span className="text-center">
                              Eliminar Pregunta
                            </span>
                          </div>
                        </Colxx>
                      </Row>
                    </CardBody>
                  </Card>
                </Colxx>
              </Row>
            </Colxx>
          </Row>
        ))}
        <Button
          outline
          onClick={this.handleAddPregunta}
          size="sm"
          color="primary"
          className="button"
        >
          {' '}
          Agregar Pregunta (múltiples opciones correctas){' '}
        </Button>
        <Button
          outline
          onClick={this.handleAddPreguntaUnicaResp}
          size="sm"
          color="primary"
          className="button btn-right"
        >
          {' '}
          Agregar Pregunta (solo una opción correcta){' '}
        </Button>
      </FormGroup>
    );
  }
}

export default AgregarPregunta;
