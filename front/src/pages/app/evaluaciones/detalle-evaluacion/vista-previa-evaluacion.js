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
    const { nombre } = data;

    this.setState({
      evaluacionId: id,
      nombre: nombre,
      ejercicios: subCollection.sort((a, b) => a.data.numero - b.data.numero),
      isLoading: false,
    });
  };

  render() {
    const { nombre, isLoading, ejercicios } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Modal
        className="modal-ejercicios"
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader>{nombre}</ModalHeader>
        <ModalBody className="modal-ejercicios-body">
          {ejercicios.map((ejercicio, index) => (
            <Row className="mb-4" key={index + 'ejer'}>
              <Colxx xxs="12">
                <Card>
                  <CardBody>
                    <CardTitle>
                      <h6 className="mb-4">
                        Ejercicio N°{ejercicio.data.numero}
                      </h6>
                    </CardTitle>
                    {ejercicio.data.tipo === TIPO_EJERCICIO.respuesta_libre && (
                      <RespuestaLibre
                        ejercicioId={index}
                        value={ejercicio.data}
                        preview="true"
                        onEjercicioChange={this.onEjercicioChange}
                      />
                    )}

                    {ejercicio.data.tipo === TIPO_EJERCICIO.opcion_multiple && (
                      <OpcionMultiple
                        ejercicioId={index}
                        value={ejercicio.data}
                        preview="true"
                        onEjercicioChange={this.onEjercicioChange}
                      />
                    )}

                    {ejercicio.data.tipo === TIPO_EJERCICIO.oral && (
                      <Oral
                        ejercicioId={index}
                        value={ejercicio.data}
                        preview="true"
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
