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
import { getDateTimeStringFromDate } from 'helpers/Utils';

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
        <Modal isOpen={isOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>{titulo}</ModalHeader>
          <ModalBody>
            {nombre}, vas a realizar la siguiente evaluacion{' '}
            <span className="text-primary">{evaluacion.data.base.nombre}</span>{' '}
            para la materia <span className="text-primary">{subject.name}</span>
            . <br></br>
            La evaluación finalizará el{' '}
            {getDateTimeStringFromDate(
              evaluacion.data.base.fecha_finalizacion,
              'DD/MM/YYYY'
            )}{' '}
            a las{' '}
            {getDateTimeStringFromDate(
              evaluacion.data.base.fecha_finalizacion,
              'HH:mm'
            )}{' '}
            hs. Luego de esa fecha y horario, no podrás realizarla.
            <h4 className="mb-4 mt-4 text-center">¡IMPORTANTE!</h4>
            {evaluacion.data.base.sin_capturas &&
              evaluacion.data.base.sin_salir_de_ventana && (
                <span>
                  Durante el desarrollo de tu evaluación, no podrás salir de la
                  pantalla, ni tomar capturas, de lo contrario la evaluación
                  será considerada como inválida y no podrás rehacerla.
                </span>
              )}
            {evaluacion.data.base.sin_capturas &&
              !evaluacion.data.base.sin_salir_de_ventana && (
                <span>
                  Durante el desarrollo de tu evaluación, no podrás tomar
                  capturas, de lo contrario la evaluación será considerada como
                  inválida y no podrás rehacerla.
                </span>
              )}
            {!evaluacion.data.base.sin_capturas &&
              evaluacion.data.base.sin_salir_de_ventana && (
                <span>
                  Durante el desarrollo de tu evaluación, no podrás salir de la
                  pantalla, de lo contrario la evaluación será considerada como
                  inválida y no podrás rehacerla.
                </span>
              )}
            <div className="mb-4 mt-4 text-center">
              <h4 className="text-center bold">
                Al comenzar la evaluacion, no podrás volver para atrás.
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
