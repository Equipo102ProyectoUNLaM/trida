import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';

const ModalGrande = ({
  toggleModal,
  modalOpen,
  modalHeader,
  children,
  text,
}) => {
  return (
    <Modal isOpen={modalOpen} size="lg" toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modalHeader && <IntlMessages id={modalHeader} />}
        {text && <span>{text}</span>}
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
};

export default ModalGrande;
