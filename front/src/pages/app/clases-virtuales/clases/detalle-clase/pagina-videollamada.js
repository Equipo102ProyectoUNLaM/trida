import React, { useState, useEffect } from 'react';
import { Prompt } from 'react-router-dom';
import { connect } from 'react-redux';
import Videollamada from 'components/videollamada/Videollamada';
import {
  Container,
  Form,
  Input,
  Button,
  Label,
  CustomInput,
  FormGroup,
} from 'reactstrap';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import ROLES from 'constants/roles';
import { editDocument, getDocumentOnSnapshot } from 'helpers/Firebase-db';

const PaginaVideollamada = (props) => {
  const room = CryptoJS.AES.decrypt(props.idSala, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  // este campo sirve para evaluar las opciones habilitadas dependiendo de si es docente o alumno
  const isHost = props.rol !== ROLES.Alumno;
  const [options, setOptions] = useState({
    microfono: true,
    camara: true,
    habilitarChat: true,
  });
  const [call, setCall] = useState(false);
  const [llamadaIniciada, setIniciada] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();

    if (props.rol !== ROLES.Alumno) {
      editDocument('clases', props.idClase, {
        iniciada: true,
        habilitarChat: options.habilitarChat,
      });
    }

    if (room) setCall(true);
  };

  const setVideollamadaOff = () => {
    setCall(false);
    if (props.rol !== ROLES.Alumno) {
      editDocument('clases', props.idClase, { iniciada: false });
    }
  };

  useEffect(() => {
    getDocumentOnSnapshot('clases', props.idClase, onClaseIniciada);
  }, [props.idClase]);

  const onClaseIniciada = (doc) => {
    const { iniciada, habilitarChat } = doc.data();

    if (habilitarChat !== undefined) {
      setOptions({
        ...options,
        habilitarChat,
      });
    }

    setIniciada(iniciada);
  };

  const handleChange = (event) => {
    setOptions({
      ...options,
      [event.target.name]: event.target.checked,
    });
  };

  return call ? (
    <>
      <Prompt
        message={(location) => {
          return location.pathname ===
            `/app/clases-virtuales/mis-clases/detalle-clase/${props.idClase}`
            ? true
            : `Estás en una clase! Estás seguro de que querés salir?`;
        }}
      />
      <Videollamada
        roomName={room}
        subject={props.subject}
        userName={`${props.nombre} ${props.apellido}`}
        password={props.password}
        containerStyles={{ width: '100%', height: '700px' }}
        options={options}
        isHost={isHost}
        setCallOff={setVideollamadaOff}
        rol={props.rol}
        idClase={props.idClase}
        preguntas={props.preguntas}
        idUser={props.user}
      />
    </>
  ) : (
    <>
      <div>
        <Container>
          <Form onSubmit={onSubmit}>
            <FormGroup className="mb-3">
              <Label className="font-weight-semibold">Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                spellCheck="true"
                placeholder="Nombre"
                value={`${props.nombre} ${props.apellido}`}
                disabled
                autoComplete="off"
              />
            </FormGroup>
            <FormGroup>
              <Label className="font-weight-semibold mt-3">
                Opciones de Videollamada
              </Label>
              <div>
                <CustomInput
                  id="microfono"
                  type="checkbox"
                  name="microfono"
                  label="Ingresar con micrófono apagado"
                  checked={options.microfono}
                  onChange={handleChange}
                />
                <CustomInput
                  id="camara"
                  type="checkbox"
                  name="camara"
                  label="Ingresar con cámara apagada"
                  checked={options.camara}
                  onChange={handleChange}
                />
                {props.rol !== ROLES.Alumno && (
                  <CustomInput
                    id="habilitarChat"
                    type="checkbox"
                    name="habilitarChat"
                    label="Habilitar chat"
                    checked={options.habilitarChat}
                    onChange={handleChange}
                  />
                )}
              </div>
            </FormGroup>
            {props.rol !== ROLES.Alumno && (
              <Button color="primary" size="lg" type="submit">
                Iniciar
              </Button>
            )}
            {props.rol === ROLES.Alumno && (
              <Button
                disabled={!llamadaIniciada}
                color="primary"
                size="lg"
                type="submit"
              >
                Ingresar
              </Button>
            )}
          </Form>
        </Container>
      </div>
    </>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { user, userData } = authUser;
  const { nombre, apellido, rol } = userData;
  return {
    user,
    nombre,
    apellido,
    rol,
  };
};

export default connect(mapStateToProps)(PaginaVideollamada);
