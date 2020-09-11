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

class ModalVistaPreviaPreguntas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preguntas: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    if (!isEmpty(this.props.preguntas)) {
      this.setState({ preguntas: this.props.preguntas });
    }
    this.setState({ isLoading: false });
  }

  render() {
    const { preguntas, isLoading } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Modal
        className="modal-ejercicios"
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
      >
        <ModalHeader>Vista previa de las preguntas</ModalHeader>
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
                        preview={true}
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

export default ModalVistaPreviaPreguntas;
