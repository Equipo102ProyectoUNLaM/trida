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
import { getDocumentWithSubCollection } from 'helpers/Firebase-db';
import { TIPO_EJERCICIO } from 'enumerators/tipoEjercicio';
import RespuestaLibre from 'pages/app/evaluaciones/ejercicios/respuesta-libre';
import OpcionMultiple from 'pages/app/evaluaciones/ejercicios/opcion-multiple';
import Oral from 'pages/app/evaluaciones/ejercicios/oral';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import { desencriptarEjercicios } from 'handlers/DecryptionHandler';
import {
  getDateWithFormat,
  getCurrentTime,
  getFormattedDate,
} from 'helpers/Utils';

export default class ModalVistaPreviaEvaluacion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluacionId: '',
      nombre: '',
      fecha_creacion: '',
      fecha_publicacion: '',
      fecha_finalizacion: '',
      descripcion: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    const evaluacion = await getDocumentWithSubCollection(
      `evaluaciones/${this.props.evalId}`,
      'ejercicios'
    );

    const { id, data, subCollection } = evaluacion;
    const { nombre, descripcion, fecha_finalizacion } = data;

    const ejerciciosDesencriptados = desencriptarEjercicios(subCollection);

    this.setState({
      evaluacionId: id,
      nombre: CryptoJS.AES.decrypt(nombre, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      fecha_finalizacion: getFormattedDate(
        CryptoJS.AES.decrypt(fecha_finalizacion, secretKey).toString(
          CryptoJS.enc.Utf8
        ),
        'DD/MM/YYYY - HH:mm'
      ),
      descripcion: CryptoJS.AES.decrypt(descripcion, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      ejercicios: ejerciciosDesencriptados.sort(
        (a, b) => a.data.numero - b.data.numero
      ),
      isLoading: false,
    });
  };

  render() {
    const {
      nombre,
      isLoading,
      ejercicios,
      descripcion,
      fecha_finalizacion,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Modal
        className="modal-ejercicios"
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader>Vista previa de evaluación {nombre}</ModalHeader>
        <ModalBody className="modal-ejercicios-body">
          <Row className="mb-4">
            <Colxx xxs="12">
              <Card>
                <CardBody>
                  <CardTitle>
                    <Row>
                      <Colxx xxs="8" xs="8" lg="8" className="col-inline">
                        <h3 className="mb-4 text-primary margin-auto margin-left-0">
                          {nombre}
                        </h3>
                      </Colxx>
                      <Colxx xxs="4" xs="4" lg="4">
                        <Row>
                          <h5>Alumno/a : Nombre y apellido</h5>
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
                    {ejercicio.data.tipo === TIPO_EJERCICIO.respuesta_libre && (
                      <RespuestaLibre
                        ejercicioId={index}
                        value={ejercicio.data}
                        preview={true}
                        onEjercicioChange={this.onEjercicioChange}
                      />
                    )}

                    {ejercicio.data.tipo === TIPO_EJERCICIO.opcion_multiple && (
                      <OpcionMultiple
                        ejercicioId={index}
                        value={ejercicio.data}
                        preview={true}
                        onEjercicioChange={this.onEjercicioChange}
                      />
                    )}

                    {ejercicio.data.tipo === TIPO_EJERCICIO.oral && (
                      <Oral
                        ejercicioId={index}
                        value={ejercicio.data}
                        preview={true}
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
          <Button color="primary" onClick={this.props.toggle}>
            Cerrar
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
