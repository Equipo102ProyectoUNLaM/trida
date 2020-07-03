import React, { useState } from 'react';
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

const PaginaVideollamada = ({ idSala }) => {
  const { handleSubmit, register, errors } = useForm();
  const room = idSala;
  // este campo sirve para evaluar las opciones habilitadas dependiendo de si es docente o alumno
  const isHost = true;

  const [options, setOptions] = useState({ microfono: true, camara: true });
  const [name, setName] = useState('');
  const [call, setCall] = useState(false);

  const onSubmit = (event) => {
    //event.preventDefault();
    if (room && name) setCall(true);
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
        roomName={idSala}
        userName={name}
        password={createRandomString()}
        containerStyles={{ width: '100%', height: '700px' }}
        options={options}
        isHost={isHost}
      />
    </>
  ) : (
    <>
      <div>
        <Container>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup className="mb-3">
              <Label>Sala</Label>
              <Input
                id="room"
                name="room"
                type="text"
                placeholder="Sala"
                value={idSala}
                disabled={true}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label>Nombre</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre"
                value={name}
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
            <Button
              color="primary"
              size="lg"
              //onClick={handleClick}
              type="submit"
            >
              Iniciar
            </Button>
          </Form>
        </Container>
      </div>
    </>
  );
};

export default PaginaVideollamada;
