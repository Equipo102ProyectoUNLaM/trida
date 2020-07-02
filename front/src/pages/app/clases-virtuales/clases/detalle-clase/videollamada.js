import React, { useState } from 'react';
import Videollamada from 'components/videollamada/videollamada';
import {
  Jumbotron,
  Container,
  Form,
  Input,
  Button,
  Label,
  CustomInput,
  FormGroup,
} from 'reactstrap';

const PaginaVideollamada = ({ idSala }) => {
  const room = idSala;
  const [name, setName] = useState('');
  const [call, setCall] = useState(false);
  const [password, setPassword] = useState('');

  const handleClick = (event) => {
    console.log(room);
    console.log(name);
    event.preventDefault();
    if (room && name) setCall(true);
  };

  return call ? (
    <>
      <Videollamada
        roomName={idSala}
        userName={name}
        password={password}
        containerStyles={{ width: '100%', height: '700px' }}
      />
    </>
  ) : (
    <>
      <div>
        <Container>
          <Form>
            <FormGroup className="mb-3">
              <Label>Sala</Label>
              <Input
                id="room"
                type="text"
                placeholder="Sala"
                value={idSala}
                disabled="true"
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label>Nombre</Label>
              <Input
                id="name"
                class="input"
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="mb-3">
              <Label>Password (opcional)</Label>
              <Input
                id="password"
                class="input"
                type="text"
                placeholder="Password (opcional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Opciones de Videollamada</Label>
              <div>
                <CustomInput
                  type="checkbox"
                  id="microfonoOff"
                  label="Ingresar con micrófono apagado"
                />
                <CustomInput
                  type="checkbox"
                  id="camaraOff"
                  label="Ingresar con cámara apagada"
                />
              </div>
            </FormGroup>
            <Button
              color="primary"
              size="lg"
              onClick={handleClick}
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
