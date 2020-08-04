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
      esEnviado,
      usuarios,
    } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          <Row className="title">{titulo}</Row>
          {fecha && <Row className="text-muted small"> {fecha}</Row>}
        </ModalHeader>
        <ModalBody>{texto}</ModalBody>
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
