import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

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
    } = this.props;
    return (
      <Modal isOpen={isOpen} toggle={toggle}>
        <ModalHeader toggle={toggle}>{titulo}</ModalHeader>
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
