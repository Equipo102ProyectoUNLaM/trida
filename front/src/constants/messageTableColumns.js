import React from 'react';
import { getDateTimeStringFromDate } from 'helpers/Utils';

export const dataReceiveTableColumns = [
  {
    Header: '',
    accessor: 'leido',
    // eslint-disable-next-line react/display-name
    Cell: (props) => (
      <div
        style={{ fontSize: '1rem' }}
        className={
          props.value
            ? 'glyph-icon simple-icon-envelope-open text-muted'
            : 'mensaje-noleido glyph-icon simple-icon-envelope'
        }
      ></div>
    ),
    width: 25,
    minWidth: 25,
    maxWidth: 25,
    style: { margin: 'auto' },
  },
  {
    id: 1,
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
