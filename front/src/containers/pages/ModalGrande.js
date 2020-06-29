import React from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import IntlMessages from "helpers/IntlMessages";

const ModalGrande = ({ toggleModal, modalOpen, modalHeader, children, buttonPrimary, buttonSecondary }) => {
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
      {(buttonPrimary || buttonSecondary) &&
      (<ModalFooter>
       {buttonPrimary && ( 
        <Button color="primary" onClick={toggleModal}>
          {buttonPrimary}
        </Button>
        )}
        {buttonSecondary && (
        <Button color="secondary" onClick={toggleModal}>
          {buttonSecondary}
        </Button>
        )}
      </ModalFooter>
      )}
    </Modal>
  );
};

export default ModalGrande;
