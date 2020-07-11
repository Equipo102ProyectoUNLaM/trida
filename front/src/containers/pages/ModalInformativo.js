import React from 'react';
import {
  CustomInput,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from 'reactstrap';
import IntlMessages from '../../helpers/IntlMessages';

const ModalInformativo = ({
  modalOpen,
  toggleModal,
  practiceName,
  modalHeader,
  onConfirmAction,
}) => {
  return (
    <Modal isOpen={modalOpen} toggle={toggleModal} size="m">
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id={modalHeader} />
      </ModalHeader>
      <ModalBody>
        <Label>¿Estás seguro que querés borrar la práctica?</Label>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onConfirmAction}>
          Confirmar
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalInformativo;
