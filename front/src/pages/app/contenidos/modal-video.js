import React, { useState } from 'react';
import VideoRecorder from 'react-video-recorder';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import IntlMessages from 'helpers/IntlMessages';
import { storage } from 'helpers/Firebase';
import {
  enviarNotificacionExitosa,
  enviarNotificacionError,
} from 'helpers/Utils-ui';
import { getTimestamp } from 'helpers/Utils';

const ModalVideo = ({
  toggleModal,
  modalOpen,
  modalHeader,
  text,
  subjectId,
}) => {
  const [videoBlob, setVideoBlob] = useState('');
  const [nombreVideo, setNombre] = useState(`video ${getTimestamp()}`);

  const guardarVideo = async () => {
    const listRef = storage.ref(
      `materias/${subjectId}/contenidos/${nombreVideo}`
    );
    try {
      await listRef.put(videoBlob);
      toggleModal();
      enviarNotificacionExitosa(
        'El video fue subido exitosamente a contenidos',
        '¡Video subido!'
      );
    } catch (error) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    }
  };
  return (
    <Modal
      isOpen={modalOpen}
      size="lg"
      toggle={toggleModal}
      className="modal-video"
    >
      <ModalHeader toggle={toggleModal}>
        {modalHeader && <IntlMessages id={modalHeader} />}
        {text && <span>{text}</span>}
      </ModalHeader>
      <ModalBody>
        <FormGroup className="form-group has-float-label">
          <Label>
            <IntlMessages id="contenido.nombre-video" />
          </Label>
          <Input
            className="form-control"
            name="nombre"
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="off"
          />
        </FormGroup>
        <VideoRecorder
          onRecordingComplete={(videoBlob) => setVideoBlob(videoBlob)}
          showReplayControls
          replayVideoAutoplayAndLoopOff
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" className="button" onClick={toggleModal}>
          Cancelar
        </Button>
        <Button color="primary" className="button" onClick={guardarVideo}>
          Guardar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalVideo;
