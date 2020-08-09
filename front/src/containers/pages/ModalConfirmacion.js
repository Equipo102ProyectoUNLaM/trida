import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
} from 'reactstrap';

export default class ModalConfirmacion extends Component {
  render() {
    const {
      texto,
      titulo,
      buttonPrimary,
      buttonSecondary,
      toggle,
      isOpen,
      onConfirm,
      fecha,
      usuarios,
      esEnviado,
    } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          <Row className="title">{titulo}</Row>
          {fecha && (
            <Row className="text-muted small fecha-mensaje"> {fecha}</Row>
          )}
        </ModalHeader>
        <ModalBody>
          <Row className="break-word">{texto}</Row>
          {usuarios && esEnviado && (
            <Row className="text-muted users-names">
              Destinatarios: {usuarios}{' '}
            </Row>
          )}
          {usuarios && !esEnviado && (
            <Row className="text-muted users-names">
              Enviado por: {usuarios}{' '}
            </Row>
          )}
        </ModalBody>
        <ModalFooter>
          {buttonPrimary && (
            <Button color="primary" size="sm" onClick={onConfirm}>
              {buttonPrimary}
            </Button>
          )}
          {buttonSecondary && (
            <Button color="secondary" size="sm" onClick={toggle}>
              {buttonSecondary}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  }
}
