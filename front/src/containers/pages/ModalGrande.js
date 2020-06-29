import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import IntlMessages from "helpers/IntlMessages";

const ModalGrande = ({ toggleModal, modalOpen, modalHeader, children }) => {
  return (
    <Modal
      isOpen={modalOpen}
      size="lg"
      toggle={toggleModal}
    >
      <ModalHeader toggle={toggleModal}>
        <IntlMessages id={modalHeader} />
      </ModalHeader>
      <ModalBody>
        {children}
      </ModalBody>
    </Modal>
  );
};

export default ModalGrande;
