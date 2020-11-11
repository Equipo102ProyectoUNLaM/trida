import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { groupBy } from 'lodash';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import { getCollection, getDocument } from 'helpers/Firebase-db';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import { isEmpty, getDateTimeStringFromDate } from 'helpers/Utils';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

class ReportesPracticas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataPracticas: [],
      open: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getCorreccionesDePracticas();
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  toggleAccordion = (tab) => {
    const prevState = this.state.open;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      open: state,
    });
  };

  getNombreUsuario = async (id) => {
    const { data } = await getDocument(`usuarios/${id}`);
    return data.nombre + ' ' + data.apellido;
  };

  getNombrePractica = async (id) => {
    const { data } = await getDocument(`practicas/${id}`);
    return data.nombre;
  };

  getCorreccionesDePracticas = async () => {
    let practicasPorAlumno = [];

    const alumnos = await getUsuariosAlumnosPorMateria(this.props.subject.id);

    const practicasVencidas = await getCollection(
      'practicas',
      [
        { field: 'idMateria', operator: '==', id: this.props.subject.id },
        { field: 'fechaVencimiento', operator: '<', id: new Date() },
      ],
      [{ order: 'fechaVencimiento', orderCond: 'desc' }]
    );

    const correcciones = await getCollection('correcciones', [
      {
        field: 'tipo',
        operator: '==',
        id: 'practica',
      },
      { field: 'idMateria', operator: '==', id: this.props.subject.id },
    ]);

    alumnos.forEach((alumno) => {
      practicasVencidas.forEach((practica) => {
        practicasPorAlumno.push({
          id: alumno.id,
          idPractica: practica.id,
          nombrePractica: practica.data.nombre,
          nombreUsuario: alumno.nombre,
          estado: 'No entregado',
          nota: '-',
          fecha: '-',
          fechaVto: getDateTimeStringFromDate(practica.data.fechaVencimiento),
        });
      });
    });

    practicasPorAlumno.forEach((practica) => {
      correcciones.forEach((correccion) => {
        if (
          practica.idPractica === correccion.data.idPractica &&
          practica.id === correccion.data.idUsuario
        ) {
          practica.estado = correccion.data.estadoCorreccion
            ? correccion.data.estadoCorreccion
            : correccion.data.estado;
          practica.fecha = correccion.data.fecha_creacion;
          practica.nota =
            correccion.data.notaCorreccion && correccion.data.notaCorreccion > 0
              ? correccion.data.notaCorreccion
              : '-';
        }
      });
    });

    let openData = [];
    practicasPorAlumno = groupBy(practicasPorAlumno, 'id');
    let dataPracticas = Object.entries(practicasPorAlumno).map((elem) => {
      const [primero] = elem[1];
      openData.push(false);
      return { id: primero.nombreUsuario, data: elem[1] };
    });
    this.setState({ dataPracticas, open: openData, isLoading: false });
  };

  render() {
    const { dataPracticas, open, isLoading } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.practicas" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        {isEmpty(dataPracticas) && <span>No hay datos sobre prácticas</span>}
        {!isEmpty(dataPracticas) && (
          <TableContainer component={Paper}>
            {dataPracticas.map((row, index) => (
              <Fragment key={index}>
                <TableRow className="mb-2">
                  <TableCell className="button-toggle">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.toggleAccordion(index)}
                    >
                      {open ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowUpIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    className="width-100 font-weight-bold"
                    onClick={() => this.toggleAccordion(index)}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell
                    className="width-100"
                    onClick={() => this.toggleAccordion(index)}
                  >
                    Cantidad de Registros: {row.data.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                    className="padding-left-inner"
                  >
                    <Collapse in={open[index]} timeout="auto">
                      <Box margin={1}>
                        <Table
                          className="data-entregas"
                          size="small"
                          aria-label="entregas"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell className="font-weight-bold">
                                Práctica
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Fecha de Vencimiento
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Fecha de Entrega
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Estado
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Nota
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.data.map((historyRow) => (
                              <TableRow
                                key={historyRow.id}
                                className={historyRow.estado.replace(/\s/g, '')}
                              >
                                <TableCell component="th" scope="row">
                                  {historyRow.nombrePractica}
                                </TableCell>
                                <TableCell>{historyRow.fechaVto}</TableCell>
                                <TableCell>
                                  {getDateTimeStringFromDate(historyRow.fecha)}
                                </TableCell>
                                <TableCell>{historyRow.estado}</TableCell>
                                <TableCell>
                                  {historyRow.nota === 0
                                    ? '-'
                                    : historyRow.nota}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableContainer>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(ReportesPracticas);
