import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  Row,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import { getFormattedDate, getFormattedTime } from 'helpers/Utils';

class ModalRealizarEvaluacion extends Component {
  render() {
    const {
      titulo,
      toggle,
      isOpen,
      onConfirm,
      nombre,
      evaluacion,
      subject,
    } = this.props;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <div>
                  <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader toggle={toggle}>{titulo}</ModalHeader>
                    <ModalBody>
                      {nombre}, vas a realizar la siguiente evaluacion{' '}
                      <span className="text-primary">
                        {evaluacion.data.base.nombre}
                      </span>{' '}
                      para la materia{' '}
                      <span className="text-primary">{subject.name}</span>.{' '}
                      <br></br>
                      La evaluación finalizará el{' '}
                      {getFormattedDate(
                        evaluacion.data.base.fecha_finalizacion,
                        'YYYY-MM-DD, HH:mm'
                      )}{' '}
                      a las{' '}
                      {getFormattedTime(
                        evaluacion.data.base.fecha_finalizacion,
                        'YYYY-MM-DD, HH:mm'
                      )}{' '}
                      hs. Luego de esa fecha y horario, no podrás realizarla.
                      <h4 className="mb-4 mt-4 text-center">¡IMPORTANTE!</h4>
                      Durante el desarrollo de tu evaluación, no podrás salir de
                      la pantalla, ni tomar capturas, de lo contrario la
                      evaluación será considerada como inválida y no podrás
                      rehacerla.
                      <div className="mb-4 mt-4 text-center">
                        <h4 className="text-center bold">
                          Al comenzar la evaluacion, no podrás volver para
                          atrás.
                        </h4>
                        <h4 className="text-center">¡Buena suerte!</h4>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onClick={onConfirm}>
                        COMENZAR EVALUACION
                      </Button>{' '}
                      <Button color="secondary" onClick={toggle}>
                        CANCELAR
                      </Button>
                    </ModalFooter>
                  </Modal>
                </div>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { userData } = authUser;
  const { nombre, apellido } = userData;
  const { subject } = seleccionCurso;
  return { nombre, apellido, subject };
};

export default connect(mapStateToProps)(ModalRealizarEvaluacion);
