import React from 'react';

export const DATA_TABLE_COLUMNS = [
  {
    id: 1,
    Header: 'Alumno',
    accessor: 'nombre',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
  {
    Header: 'Hora Conexión',
    accessor: 'timeStampConexion',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
  {
    Header: 'Hora Desconexión',
    accessor: 'timeStampDesconexion',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
  {
    Header: 'Tiempo Conexión',
    accessor: 'tiempoNeto',
    // eslint-disable-next-line react/display-name
    Cell: (props) => (
      <p>{props.value < 1 ? '< 1 minuto' : `${props.value} minutos`} </p>
    ),
  },
];
