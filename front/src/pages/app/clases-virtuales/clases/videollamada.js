import React, { useState } from 'react'
import Videollamada from 'components/videollamada/videollamada';

function PaginaVideollamada() {
  const [room, setRoom] = useState('')
  const [name, setName] = useState('')
  const [call, setCall] = useState(false)
  const [password, setPassword] = useState('')

  const handleClick = event => {
    event.preventDefault()
    if (room && name) setCall(true)
  }

  return call ? (
      <>
      <Videollamada
        roomName={room}
        userName={name}
        password={password}
        containerStyles={{ width: '100%', height: '700px' }}
      />
      </>
  ) : (
    <>
     {/*  <Container>
          <Input id='room' type="text" placeholder="Sala" value={room} onChange={(e) => setRoom(e.target.value)}/>
          <Input id='name' class="input" type='text' placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} />
          <Input id='password' class="input" type='text' placeholder='Password (opcional)' value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={handleClick} type='submit'>Iniciar</Button>
      </Container> */}
    </>
  )
}

export default PaginaVideollamada;