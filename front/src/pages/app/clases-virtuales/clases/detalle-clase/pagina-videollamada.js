import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Videollamada from 'components/videollamada/videollamada';
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
import { editDocument, getDatosClaseOnSnapshot } from 'helpers/Firebase-db';

const PaginaVideollamada = (props) => {
  const room = CryptoJS.AES.decrypt(props.idSala, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  // este campo sirve para evaluar las opciones habilitadas dependiendo de si es docente o alumno
  const isHost = props.rol === ROLES.Docente;

  const [options, setOptions] = useState({ microfono: true, camara: true });
  const [call, setCall] = useState(false);
  const [llamadaIniciada, setIniciada] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    editDocument('clases', props.idClase, { iniciada: true });
    if (room) setCall(true);
  };

  const setVideollamadaOff = () => {
    setCall(false);
    editDocument('clases', props.idClase, { iniciada: false });
  };

  useEffect(() => {
    getDatosClaseOnSnapshot('clases', props.idClase, onClaseIniciada);
  }, [props.idClase]);

  const onClaseIniciada = (doc) => {
    const { iniciada } = doc.data();
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
      <Videollamada
        roomName={room}
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
              <Label>Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre"
                value={`${props.nombre} ${props.apellido}`}
                disabled
                autocomplete="off"
              />
            </FormGroup>
            <FormGroup>
              <Label>Opciones de Videollamada</Label>
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
              </div>
            </FormGroup>
            {props.rol === ROLES.Docente && (
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
    user,
  };
};

export default connect(mapStateToProps)(PaginaVideollamada);
