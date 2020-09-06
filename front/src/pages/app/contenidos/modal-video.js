import React from 'react';
import VideoRecorder from 'react-video-recorder';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';

const ModalVideo = ({ toggleModal, modalOpen, modalHeader, text }) => {
  return (
    <Modal isOpen={modalOpen} size="lg" toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modalHeader && <IntlMessages id={modalHeader} />}
        {text && <span>{text}</span>}
      </ModalHeader>
      <ModalBody>
        <VideoRecorder
          onRecordingComplete={(videoBlob) => {
            // Do something with the video...
            console.log('videoBlob', videoBlob);
          }}
        />
      </ModalBody>
    </Modal>
  );
};

export default ModalVideo;
