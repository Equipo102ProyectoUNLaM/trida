import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';

const ModalChico = ({
  toggleModal,
  modalOpen,
  modalHeader,
  children,
  text,
}) => {
  return (
    <Modal isOpen={modalOpen} size="m" toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modalHeader && <IntlMessages id={modalHeader} />}
        {text && <span>{text}</span>}
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  );
};

export default ModalChico;
