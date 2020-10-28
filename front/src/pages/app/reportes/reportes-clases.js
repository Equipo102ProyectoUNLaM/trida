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
import { isEmpty, getDateTimeStringFromDate } from 'helpers/Utils';
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

  toggleAccordion = (tab) => {
    const prevState = this.state.openAsistencia;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      openAsistencia: state,
    });
  };

  toggleAccordionPreguntas = (tab) => {
    const prevState = this.state.openPreguntas;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      openPreguntas: state,
    });
  };

  getDataClases = async () => {
    const clasesCollection = await getCollection('clases', [
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

    const clasesPromise = clasesCollection.map(async (clase) => {
      return {
        id: clase.id,
        asistencia: clase.data.asistencia,
        idMateria: clase.data.idMateria,
        nombre: clase.data.nombre,
        fecha: clase.data.fecha_clase,
      };
    });

    let clases = await Promise.all(clasesPromise);
    let asistenciaClase = [];
    let preguntasAnonimasAlumnos = [];
    for (let clase of clases) {
      const preguntasAnonimas = await getDocumentWithSubCollection(
        `preguntasDeAlumno/${clase.id}`,
        'preguntas'
      );

      for (const usuario of data.usuario_id) {
        const alumno = await getDocument(`usuarios/${usuario}`);
        if (alumno.data.rol === ROLES.Alumno) {
          asistenciaClase.push(await this.getAsistencia(clase, alumno.data));
          preguntasAnonimasAlumnos.push(
            await this.getPreguntasAnonimas(
              preguntasAnonimas.subCollection,
              clase,
              alumno.data
            )
          );
        }
      }
    }

    let openData = [];
    asistenciaClase = groupBy(asistenciaClase, 'user');
    asistenciaClase = Object.entries(asistenciaClase).map((elem) => {
      openData.push(false);
      return { id: elem[0], data: elem[1] };
    });
    this.setState({
      asistenciaClase,
      openAsistencia: openData,
      isLoading: false,
    });

    openData = [];
    preguntasAnonimasAlumnos = groupBy(preguntasAnonimasAlumnos, 'user');
    preguntasAnonimasAlumnos = Object.entries(preguntasAnonimasAlumnos).map(
      (elem) => {
        openData.push(false);
        return { id: elem[0], data: elem[1] };
      }
    );
    console.log(preguntasAnonimasAlumnos);
    this.setState({
      preguntasAnonimasAlumnos,
      openPreguntas: openData,
      isLoading: false,
    });
  };

  getAsistencia(clase, usuario) {
    if (clase.asistencia) {
      const asistenciaUsuario = clase.asistencia.filter(
        (asistencia) => asistencia.user === usuario.id
      );
      if (asistenciaUsuario.length) {
        let tiempoAsistencia = 0;
        for (const asist of asistenciaUsuario) {
          tiempoAsistencia += asist.tiempoNeto;
        }
        return {
          id: clase.id,
          tiempo: tiempoAsistencia,
          user: usuario.nombre + ' ' + usuario.apellido,
          nombreClase: clase.nombre,
          fecha: clase.fecha,
        };
      }
    }
    return {
      id: clase.id,
      tiempo: 0,
      user: usuario.nombre + ' ' + usuario.apellido,
      nombreClase: clase.nombre,
      fecha: clase.fecha,
    };
  }

  getPreguntasAnonimas(preguntasAnonimas, clase, usuario) {
    const preguntasAlumno =
      preguntasAnonimas.length > 0
        ? preguntasAnonimas.filter(
            (pregunta) => pregunta.data.creador === usuario.id
          )
        : [];
    return {
      id: clase.id,
      preguntas: preguntasAlumno.length,
      user: usuario.nombre + ' ' + usuario.apellido,
      nombreClase: clase.nombre,
      fecha: clase.fecha,
    };
  }

  render() {
    const {
      asistenciaClase,
      preguntasAnonimasAlumnos,
      openAsistencia,
      openPreguntas,
      isLoading,
    } = this.state;
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
        <Row>
          <h2 className="titulo-asistencia">Asistencia a Clases</h2>
        </Row>
        {isEmpty(asistenciaClase) && (
          <span>No hay datos sobre asistencia a clases</span>
        )}
        {!isEmpty(asistenciaClase) && (
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
                                Clases
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Fecha de Clase
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Tiempo
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.data.map((historyRow) => (
                              <TableRow
                                key={historyRow.id}
                                className={
                                  historyRow.tiempo === 0
                                    ? 'Ausente'
                                    : 'Presente'
                                }
                              >
                                <TableCell component="th" scope="row">
                                  {historyRow.nombreClase}
                                </TableCell>
                                <TableCell>
                                  {getDateTimeStringFromDate(historyRow.fecha)}
                                </TableCell>
                                <TableCell>
                                  {historyRow.tiempo === 0
                                    ? 'Ausente'
                                    : historyRow.tiempo + ' minutos'}
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

        <Row>
          <h2 className="titulo-asistencia">Preguntas realizadas en Clases</h2>
        </Row>
        {isEmpty(asistenciaClase) && (
          <span>No hay datos sobre preguntas realizadas en clase</span>
        )}
        {!isEmpty(preguntasAnonimasAlumnos) && (
          <TableContainer component={Paper}>
            {preguntasAnonimasAlumnos.map((row, index) => (
              <Fragment key={index}>
                <TableRow className="mb-2">
                  <TableCell className="button-toggle">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.toggleAccordionPreguntas(index)}
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
                    onClick={() => this.toggleAccordionPreguntas(index)}
                  >
                    {row.id}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                    className="padding-left-inner"
                  >
                    <Collapse in={openPreguntas[index]} timeout="auto">
                      <Box margin={1}>
                        <Table
                          className="data-entregas"
                          size="small"
                          aria-label="entregas"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell className="font-weight-bold">
                                Clases
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Fecha de Clase
                              </TableCell>
                              <TableCell className="font-weight-bold">
                                Preguntas realizadas
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.data.map((historyRow) => (
                              <TableRow
                                key={historyRow.id}
                                className={
                                  historyRow.preguntas === 0
                                    ? 'Ausente'
                                    : 'Presente'
                                }
                              >
                                <TableCell component="th" scope="row">
                                  {historyRow.nombreClase}
                                </TableCell>
                                <TableCell>
                                  {getDateTimeStringFromDate(historyRow.fecha)}
                                </TableCell>
                                <TableCell>
                                  {historyRow.preguntas === 0
                                    ? 'Sin preguntas'
                                    : historyRow.preguntas}
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
