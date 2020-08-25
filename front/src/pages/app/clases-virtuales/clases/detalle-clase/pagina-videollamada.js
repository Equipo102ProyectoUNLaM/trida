import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
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
import { createRandomString } from 'helpers/Utils';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

const PaginaVideollamada = (props) => {
  const { handleSubmit, register, errors } = useForm();
  const room = CryptoJS.AES.decrypt(props.idSala, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  // este campo sirve para evaluar las opciones habilitadas dependiendo de si es docente o alumno
  const isHost = true;

  const [options, setOptions] = useState({ microfono: true, camara: true });
  const [name, setName] = useState(props.nombre + ' ' + props.apellido);
  const [call, setCall] = useState(false);

  const onSubmit = (event) => {
    //event.preventDefault();
    if (room && name) setCall(true);
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
        userName={name}
        password={createRandomString()}
        containerStyles={{ width: '100%', height: '700px' }}
        options={options}
        isHost={isHost}
        setCallOff={setVideollamadaOff}
        rol={props.rol}
      />
    </>
  ) : (
    <>
      <div>
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup className="mb-3">
              <Label>Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre"
                value={`${props.nombre} ${props.apellido}`}
                disabled
                onChange={(e) => setName(e.target.value)}
                innerRef={register({
                  required: 'El nombre es requerido!',
                })}
              />
              {errors.name && (
                <FormText className="error-text-color">
                  {errors.name.message}
                </FormText>
              )}
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
