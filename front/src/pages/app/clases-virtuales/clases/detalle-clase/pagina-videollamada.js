import React, { useState } from 'react';
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
  FormText,
} from 'reactstrap';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import ROLES from 'constants/roles';

const PaginaVideollamada = (props) => {
  const room = CryptoJS.AES.decrypt(props.idSala, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  // este campo sirve para evaluar las opciones habilitadas dependiendo de si es docente o alumno
  const isHost = props.rol === ROLES.Docente;

  const [options, setOptions] = useState({ microfono: true, camara: true });
  const [call, setCall] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    if (room) setCall(true);
  };

  const setVideollamadaOff = () => {
    setCall(false);
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
            <Button color="primary" size="lg" type="submit">
              Iniciar
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
};

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { nombre, apellido, rol } = userData;
  return {
    nombre,
    apellido,
    rol,
  };
};

export default connect(mapStateToProps)(PaginaVideollamada);
