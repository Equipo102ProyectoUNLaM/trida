import React from 'react';
import AudioRecorder from 'react-audio-recorder';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';

const ModalAudio = ({ toggleModal, modalOpen, modalHeader, text }) => {
  return (
    <Modal isOpen={modalOpen} size="lg" toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modalHeader && <IntlMessages id={modalHeader} />}
        {text && <span>{text}</span>}
      </ModalHeader>
      <ModalBody>
        <AudioRecorder
          playLabel="Reproducir"
          recordLabel="Grabar"
          downloadLabel="Guardar"
        />
      </ModalBody>
    </Modal>
  );
};

export default ModalAudio;
