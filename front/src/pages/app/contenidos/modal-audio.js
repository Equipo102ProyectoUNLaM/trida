import React, { useState } from 'react';
import useGrabadorAudio from './grabador-audio';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Row,
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

const ModalAudio = ({
  toggleModal,
  modalOpen,
  modalHeader,
  text,
  subjectId,
}) => {
  let [
    audioURL,
    audioBlob,
    isRecording,
    startRecording,
    stopRecording,
  ] = useGrabadorAudio();
  const [nombreAudio, setNombre] = useState(`audio ${getTimestamp()}`);

  const guardarAudio = async () => {
    const listRef = storage.ref(
      `materias/${subjectId}/contenidos/${nombreAudio}`
    );
    try {
      await listRef.put(audioBlob);
      toggleModal();
      enviarNotificacionExitosa(
        'El audio fue subido exitosamente a contenidos',
        '¡Audio subido!'
      );
    } catch (error) {
      enviarNotificacionError('Hubo un error. Reintentá mas tarde', 'Ups!');
    }
  };

  return (
    <Modal isOpen={modalOpen} size="lg" toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {modalHeader && <IntlMessages id={modalHeader} />}
        {text && <span>{text}</span>}
      </ModalHeader>
      <ModalBody>
        <FormGroup className="form-group has-float-label">
          <Label>
            <IntlMessages id="contenido.nombre-audio" />
          </Label>
          <Input
            className="form-control"
            name="nombre"
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="off"
          />
        </FormGroup>
        <p className="tip-text">
          Para escuchar tu grabación, presioná ▶ al detenerla
        </p>
        <Row className="no-margin-left">
          <audio src={audioURL} controls />
          <Button
            color="primary"
            className="button-margin"
            onClick={startRecording}
            disabled={isRecording}
          >
            Iniciar grabación
          </Button>
          <Button
            className="button-margin"
            onClick={stopRecording}
            disabled={!isRecording}
          >
            Detener grabación
          </Button>
        </Row>
        <Row className="ml-0 mt-1">
          {isRecording && (
            <>
              <div className="grabando-circulo" />
              <p className="grabando-texto">Grabando!</p>{' '}
            </>
          )}
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" className="button" onClick={guardarAudio}>
          Guardar
        </Button>
        <Button color="primary" className="button" onClick={toggleModal}>
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalAudio;
