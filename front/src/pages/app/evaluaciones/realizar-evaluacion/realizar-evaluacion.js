import React, { Component, Fragment } from 'react';
import {
  Row,
  Card,
  CardBody,
  CardTitle,
  Button,
  ModalFooter,
} from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Colxx } from 'components/common/CustomBootstrap';
import { getDocumentWithSubCollection } from 'helpers/Firebase-db';
import { TIPO_EJERCICIO } from 'enumerators/tipoEjercicio';
import { ESTADO_ENTREGA } from 'enumerators/estadoEntrega';
import { TIPO_ENTREGA } from 'enumerators/tipoEntrega';
import RespuestaLibre from 'pages/app/evaluaciones/ejercicios/respuesta-libre';
import OpcionMultiple from 'pages/app/evaluaciones/ejercicios/opcion-multiple';
import OpcionMultipleImagen from 'pages/app/evaluaciones/ejercicios/opcion-multiple-imagen';
import Oral from 'pages/app/evaluaciones/ejercicios/oral';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import { desencriptarEjercicios } from 'handlers/DecryptionHandler';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';

import {
  getDateWithFormat,
  getCurrentTime,
  getFechaHoraActual,
  getDateTimeStringFromDate,
} from 'helpers/Utils';
import { addDocument } from 'helpers/Firebase-db';
import PreguntasAleatorias from '../ejercicios/preguntas_aleatorias';
import AdjuntarDesarrollo from '../ejercicios/adjuntar_desarrollo';

class RealizarEvaluacion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      evaluacionId: '',
      nombreEval: '',
      fecha_publicacion: '',
      fecha_finalizacion: '',
      descripcion: '',
      ejercicios: [],
      respuestas: [],
      submitted: false,
      modalFinishOpen: false,
      isLoading: true,
    };
  }

  async componentDidMount() {
    await this.getEvaluacion();
  }

  getEvaluacion = async () => {
    if (!this.props.location.evalId) {
      this.setState({ isLoading: false });
      this.props.history.push(`/app/evaluaciones`);
    }
    const evaluacion = await getDocumentWithSubCollection(
      `evaluaciones/${this.props.location.evalId}`,
      'ejercicios'
    );

    const { id, data, subCollection } = evaluacion;
    const { nombre, fecha_finalizacion, fecha_publicacion, descripcion } = data;

    const ejerciciosDesencriptados = desencriptarEjercicios(
      subCollection,
      true
    ).sort((a, b) => a.data.numero - b.data.numero);

    let respuestas = [];
    for (const ejercicio of ejerciciosDesencriptados) {
      let obj = {
        id: ejercicio.id,
        numero: ejercicio.data.numero,
        tipo: ejercicio.data.tipo,
        nombre: ejercicio.data.nombre,
      };
      switch (obj.tipo) {
        case TIPO_EJERCICIO.opcion_multiple:
        case TIPO_EJERCICIO.opcion_multiple_imagen: {
          if (ejercicio.data.opciones && ejercicio.data.opciones.lenght !== 0) {
            let respuestas_choice = [];
            ejercicio.data.opciones.forEach((opcion, index) => {
              respuestas_choice.push(false);
            });

            obj = Object.assign(obj, { respuesta: respuestas_choice });
          }
          break;
        }
        case TIPO_EJERCICIO.preguntas_aleatorias: {
          obj = Object.assign(obj, { respuesta: [] });
          break;
        }
        default:
          obj = Object.assign(obj, { respuesta: '' });
      }
      respuestas.push(obj);
    }
    this.setState({
      respuestas: respuestas,
      evaluacionId: id,
      nombreEval: CryptoJS.AES.decrypt(nombre, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      fecha_finalizacion: getDateTimeStringFromDate(fecha_finalizacion),
      fecha_publicacion: getDateTimeStringFromDate(fecha_publicacion),
      descripcion: CryptoJS.AES.decrypt(descripcion, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      ejercicios: ejerciciosDesencriptados.sort(
        (a, b) => a.data.numero - b.data.numero
      ),
      isLoading: false,
    });
  };

  onEjercicioChange = (e, numero) => {
    let respuestas = this.state.respuestas;
    let ejercicio = respuestas.find((x) => x.numero === numero);
    switch (ejercicio.tipo) {
      case TIPO_EJERCICIO.respuesta_libre:
        ejercicio.respuesta = e.respuesta;
        break;
      case TIPO_EJERCICIO.opcion_multiple:
      case TIPO_EJERCICIO.opcion_multiple_imagen:
        ejercicio.respuesta[e.indiceOpcion] = e.respuesta;
        break;
      case TIPO_EJERCICIO.preguntas_aleatorias:
        {
          ejercicio.respuesta = e;
        }
        break;
      default:
        break;
    }
    this.setState({
      respuestas: respuestas, //Aca quedan las respuestas actualizadas
    });
  };

  finalizarEvaluacion = () => {
    if (this.validateRespuestas() === true) {
      this.toggleModal();
    }
  };

  entregarEvaluacion = async () => {
    let obj = {
      estado: ESTADO_ENTREGA.no_corregido,
      fecha_entrega: getFechaHoraActual(),
      id_alumno: this.props.user,
      id_materia: this.props.subject.id,
      id_entrega: this.state.evaluacionId,
      tipo: TIPO_ENTREGA.evaluacion,
      version: 0,
      respuestas: this.state.respuestas,
    };
    await addDocument(
      `correcciones`,
      obj,
      this.props.user,
      'Evaluación entregada con éxito',
      'Tu evaluación fue entregada correctamente',
      'Tu evaluación no pudo ser entregada'
    );
    this.props.history.push(`/app/evaluaciones`);
  };

  validateRespuestas = () => {
    this.setState({
      submitted: true,
    });
    let valid = true;
    for (const rta of this.state.respuestas) {
      switch (rta.tipo) {
        case TIPO_EJERCICIO.oral:
          break;
        case TIPO_EJERCICIO.respuesta_libre:
          if (!rta.respuesta || rta.respuesta === '') valid = false;
          break;
        case TIPO_EJERCICIO.opcion_multiple:
          if (!rta.respuesta.find((x) => x === true)) valid = false;
          break;
        case TIPO_EJERCICIO.preguntas_aleatorias:
          if (
            rta.respuesta.find((x) => !x.respuesta) ||
            rta.respuesta.length !=
              this.state.ejercicios.find(
                (x) => x.data.numero.toString() === rta.numero.toString()
              ).data.cantidad
          )
            valid = false;
          break;
        default:
          break;
      }
    }
    return valid;
  };

  toggleModal = () => {
    this.setState({
      modalFinishOpen: !this.state.modalFinishOpen,
    });
  };

  render() {
    const {
      nombreEval,
      isLoading,
      ejercicios,
      descripcion,
      fecha_finalizacion,
      modalFinishOpen,
      submitted,
    } = this.state;
    const { nombre, apellido } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Card>
          <CardBody>
            <div className="background-evaluaciones">
              <Row className="mb-4">
                <Colxx xxs="12">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <Row>
                          <Colxx xxs="8" xs="8" lg="8" className="col-inline">
                            <h3 className="mb-4 text-primary margin-auto margin-left-0">
                              {nombreEval}
                            </h3>
                          </Colxx>
                          <Colxx xxs="4" xs="4" lg="4">
                            <Row>
                              <h5>
                                Alumno/a : {nombre} {apellido}
                              </h5>
                            </Row>
                            <Row>
                              <h5>
                                Fecha : {getDateWithFormat()}&nbsp; Hora:{' '}
                                {getCurrentTime()} hs
                              </h5>
                            </Row>
                          </Colxx>
                        </Row>
                      </CardTitle>
                      <div className="mb-4">
                        <h5>{descripcion}</h5>
                      </div>
                      <div>
                        <h5 className="text-red">
                          Fecha y hora de finalizacion: {fecha_finalizacion} hs
                        </h5>
                      </div>
                    </CardBody>
                  </Card>
                </Colxx>
              </Row>

              {ejercicios.map((ejercicio, index) => (
                <Row className="mb-4" key={index + 'ejer'}>
                  <Colxx xxs="12">
                    <Card>
                      <CardBody>
                        <CardTitle>
                          <h5 className="mb-4">
                            Ejercicio N°{ejercicio.data.numero}
                          </h5>
                        </CardTitle>
                        {ejercicio.data.tipo ===
                          TIPO_EJERCICIO.respuesta_libre && (
                          <RespuestaLibre
                            ejercicioId={index}
                            value={ejercicio.data}
                            submitted={submitted}
                            resolve={true}
                            onEjercicioChange={this.onEjercicioChange}
                          />
                        )}

                        {ejercicio.data.tipo ===
                          TIPO_EJERCICIO.opcion_multiple && (
                          <OpcionMultiple
                            ejercicioId={index}
                            value={ejercicio.data}
                            submitted={submitted}
                            resolve={true}
                            onEjercicioChange={this.onEjercicioChange}
                          />
                        )}

                        {ejercicio.data.tipo ===
                          TIPO_EJERCICIO.opcion_multiple_imagen && (
                          <OpcionMultipleImagen
                            ejercicioId={index}
                            value={ejercicio.data}
                            submitted={submitted}
                            resolve={true}
                            onEjercicioChange={this.onEjercicioChange}
                          />
                        )}

                        {ejercicio.data.tipo === TIPO_EJERCICIO.oral && (
                          <Oral
                            ejercicioId={index}
                            value={ejercicio.data}
                            submitted={submitted}
                            resolve={true}
                            onEjercicioChange={this.onEjercicioChange}
                          />
                        )}

                        {ejercicio.data.tipo ===
                          TIPO_EJERCICIO.preguntas_aleatorias && (
                          <PreguntasAleatorias
                            ejercicioId={index}
                            value={ejercicio.data}
                            submitted={submitted}
                            resolve={true}
                            onEjercicioChange={this.onEjercicioChange}
                          />
                        )}

                        {ejercicio.data.tipo ===
                          TIPO_EJERCICIO.adjuntar_desarrollo && (
                          <AdjuntarDesarrollo
                            ejercicioId={index}
                            value={ejercicio.data}
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
            </div>
            <ModalFooter>
              <Button color="primary" onClick={this.finalizarEvaluacion}>
                FINALIZAR EVALUACION
              </Button>

              <Button color="secondary">ABANDONAR</Button>
            </ModalFooter>
          </CardBody>
        </Card>
        {modalFinishOpen && (
          <ModalConfirmacion
            texto="Recordá que una vez finalizada, no podrás editarla"
            titulo="¿Estás seguro de finalizar tu evaluación?"
            buttonPrimary="Entregar"
            buttonSecondary="Cancelar"
            toggle={this.toggleModal}
            isOpen={modalFinishOpen}
            onConfirm={this.entregarEvaluacion}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { userData, user } = authUser;
  const { nombre, apellido } = userData;
  const { subject } = seleccionCurso;
  return { nombre, apellido, user, subject };
};

export default connect(mapStateToProps)(withRouter(RealizarEvaluacion));
