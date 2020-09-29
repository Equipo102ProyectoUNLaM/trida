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
      modalFooterClassname,
    } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className={modalFooterClassname ? 'modal-detalle-mensaje' : ''}
      >
        <ModalHeader toggle={toggle}>
          <Row className="title">{titulo}</Row>
          {fecha && (
            <Row className="text-muted small align-items-center">
              <i className="iconsminds-endways mr-1" />
              {fecha}
            </Row>
          )}
        </ModalHeader>
        <ModalBody>
          <Row className="break-word texto-mensaje">{texto}</Row>
          {usuarios && esEnviado && (
            <Row className="text-muted users-names">
              <i className="iconsminds-mail-with-at-sign mr-1 icono-mensaje" />
              Destinatarios: {usuarios}{' '}
            </Row>
          )}
          {usuarios && !esEnviado && (
            <Row className="text-muted users-names">
              <i className="iconsminds-mail-with-at-sign mr-1 icono-mensaje" />
              Enviado por: {usuarios}{' '}
            </Row>
          )}
        </ModalBody>
        <ModalFooter className={modalFooterClassname}>
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
