import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { groupBy } from 'lodash';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import {
  getCollection,
  getDocument,
  getDocumentWithSubCollection,
} from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import ROLES from 'constants/roles';
import firebase from 'firebase/app';
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

class ReportesClases extends Component {
  constructor(props) {
    super(props);

    this.state = {
      asistenciaClase: [],
      preguntasAnonimasAlumnos: [],
      respuestasClase: [],
      openAsistencia: [],
      openPreguntas: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDataClases();
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

  getDataClases = async () => {
    const clases = await getCollection('clases', [
      {
        field: 'fecha_clase',
        operator: '<',
        id: firebase.firestore.Timestamp.now(),
      },
      { field: 'idMateria', operator: '==', id: this.props.subject.id },
      { field: 'activo', operator: '==', id: true },
    ]);
    const { data } = await getDocument(
      `usuariosPorMateria/${this.props.subject.id}`
    );

    let asistenciaClase = [];
    let preguntasAnonimasAlumnos = [];

    clases.forEach(async (clase) => {
      const preguntasAnonimas = await getDocumentWithSubCollection(
        `preguntasDeAlumno/${clase}`,
        'preguntas'
      );

      for (const usuario of data.usuario_id) {
        const alumno = await getDocument(`usuarios/${usuario}`);
        if (alumno.data.rol === ROLES.Alumno) {
          asistenciaClase.push(
            this.getAsistencia(clase.asistencia, alumno.data, clase.id)
          );
          preguntasAnonimasAlumnos.push(
            this.getPreguntasAnonimas(
              preguntasAnonimas.subCollection,
              alumno.data,
              clase.id
            )
          );
        }
      }
    });

    let openData = [];
    asistenciaClase = groupBy(asistenciaClase, 'id');
    asistenciaClase = Object.entries(asistenciaClase).map((elem) => {
      openData.push(false);
      return { id: elem[0], data: elem[1] };
    });
    this.setState({ asistenciaClase, openAsistencia: openData });

    openData = [];
    preguntasAnonimasAlumnos = groupBy(preguntasAnonimasAlumnos, 'id');
    preguntasAnonimasAlumnos = Object.entries(preguntasAnonimasAlumnos).map(
      (elem) => {
        openData.push(false);
        return { id: elem[0], data: elem[1] };
      }
    );
    this.setState({
      preguntasAnonimasAlumnos,
      openPreguntas: openData,
      isLoading: false,
    });
  };

  getAsistencia(asistencia, usuario, claseId) {
    if (asistencia) {
      const asistenciaUsuario = asistencia.filter(
        (asistencia) => asistencia.user === usuario.id
      );
      if (asistenciaUsuario) {
        let tiempoAsistencia = 0;
        for (const asist of asistenciaUsuario) {
          tiempoAsistencia += asist.tiempoNeto;
        }
        return {
          id: usuario.id,
          tiempo: tiempoAsistencia,
          user: usuario.nombre + ' ' + usuario.apellido,
          clase: claseId,
        };
      }
    }
    return {
      id: usuario.id,
      tiempo: 0,
      user: usuario.nombre + ' ' + usuario.apellido,
      clase: claseId,
    };
  }

  getPreguntasAnonimas(preguntasAnonimas, usuario, claseId) {
    const preguntasAlumno =
      preguntasAnonimas.length > 0
        ? preguntasAnonimas.filter((pregunta) => pregunta.creador === usuario)
        : [];
    return {
      id: usuario.id,
      preguntas: preguntasAlumno.length(),
      user: usuario.nombre + ' ' + usuario.apellido,
      clase: claseId,
    };
  }

  render() {
    const { asistenciaClase, openAsistencia, isLoading } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.clases" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        {isEmpty(asistenciaClase) && (
          <span>No hay datos sobre asistencia a clases</span>
        )}
        {!isEmpty(asistenciaClase) && (
          // <Row><h2 className="title">Asistencia a Clases</h2></Row>
          <TableContainer component={Paper}>
            {asistenciaClase.map((row, index) => (
              <Fragment key={index}>
                <TableRow className="mb-2">
                  <TableCell className="button-toggle">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.toggleAccordion(index)}
                    >
                      {openAsistencia ? (
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
                    Cantidad de Entregas: {row.data.length}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                    className="padding-left-inner"
                  >
                    <Collapse in={openAsistencia[index]} timeout="auto">
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
                                className={historyRow.estado}
                              >
                                <TableCell component="th" scope="row">
                                  {historyRow.nombrePractica}
                                </TableCell>
                                <TableCell>{historyRow.fecha}</TableCell>
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

export default connect(mapStateToProps)(ReportesClases);
