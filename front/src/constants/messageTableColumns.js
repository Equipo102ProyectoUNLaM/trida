import React from 'react';

export const dataReceiveTableColumns = [
  {
    id: 1,
    Header: '',
    accessor: 'leido',
    // eslint-disable-next-line react/display-name
    Cell: (props) => (
      <span className={props.value ? '' : 'mensaje-noleido'}>
        {props.value ? '' : '.'}
      </span>
    ),
  },
  {
    Header: 'Fecha',
    accessor: 'fecha_creacion',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
  {
    Header: 'Remitente',
    accessor: 'remitente',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
  {
    Header: 'Asunto',
    accessor: 'asunto',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
];

export const dataSentTableColumns = [
  {
    id: 1,
    Header: 'Fecha',
    accessor: 'fecha_creacion',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
  {
    Header: 'Destinatario',
    accessor: 'destinatarios',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
  {
    Header: 'Asunto',
    accessor: 'asunto',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p>{props.value}</p>,
  },
];
