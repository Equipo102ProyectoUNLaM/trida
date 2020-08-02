import React from 'react';

export const dataReceiveTableColumns = [
  {
    Header: 'Fecha',
    accessor: 'fecha_creacion',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="list-item-heading">{props.value}</p>,
  },
  {
    Header: 'Remitente',
    accessor: 'remitente',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
  {
    Header: 'Asunto',
    accessor: 'asunto',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
];

export const dataSentTableColumns = [
  {
    Header: 'Fecha',
    accessor: 'fecha_creacion',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
  {
    Header: 'Destinatario',
    accessor: 'destinatario',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
  {
    Header: 'Asunto',
    accessor: 'asunto',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
];
