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
    accessor: 'receptor',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
  {
    Header: 'Asunto',
    accessor: 'asunto',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
  // {
  //   header: '',
  //   id: 'click-me-button',
  //   render: ({ row }) => (<button onClick={(e) => this.handleButtonClick(e, row)}>Click Me</button>)
  // }
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
    accessor: 'receptor',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
  {
    Header: 'Asunto',
    accessor: 'asunto',
    // eslint-disable-next-line react/display-name
    Cell: (props) => <p className="text-muted">{props.value}</p>,
  },
  // {
  //   header: '',
  //   id: 'click-me-button',
  //   render: ({ row }) => (<button onClick={(e) => this.handleButtonClick(e, row)}>Click Me</button>)
  // }
];
