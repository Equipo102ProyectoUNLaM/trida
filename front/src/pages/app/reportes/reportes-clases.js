import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { groupBy } from 'lodash';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import {
  getCollection,
  getDocumentWithSubCollection,
  getCollectionWithSubCollections,
} from 'helpers/Firebase-db';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import { isEmpty, getDateTimeStringFromDate } from 'helpers/Utils';
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
      asistenciaYPreguntasClase: [],
      preguntasAnonimasAlumnos: [],
      openAsistenciaYPreguntas: [],
      respuestasPreguntasDeClase: [],
      openRespuestasPreguntasDeClase: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDataClases();
  }

  toggleAccordion = (tab) => {
    const prevState = this.state.openAsistenciaYPreguntas;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      openAsistenciaYPreguntas: state,
    });
  };

  toggleAccordionRespuestasDeAlumnos = (tab) => {
    const prevState = this.state.openRespuestasPreguntasDeClase;
    const state = prevState.map((x, index) => (tab === index ? !x : x));
    this.setState({
      openRespuestasPreguntasDeClase: state,
    });
  };

  getRespuestasDeAlumnos = async () => {
    return await getCollection('respuestasPreguntasClase', [
      { field: 'idMateria.id', operator: '==', id: this.props.subject.id },
      { field: 'activo', operator: '==', id: true },
    ]);
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

    const usuarios = await getUsuariosAlumnosPorMateria(this.props.subject.id);
    const respuestas = await this.getRespuestasDeAlumnos();

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
    let asistenciaYPreguntasClase = [];
    let respuestasPromise = [];

    for (let clase of clases) {
      const preguntasAnonimas = await getDocumentWithSubCollection(
        `preguntasDeAlumno/${clase.id}`,
        'preguntas'
      );

      const preguntasConRespuestas = await getCollectionWithSubCollections(
        `clases/${clase.id}/preguntas`,
        null,
        null,
        'respuestas'
      );

      usuarios.forEach((alumno) => {
        asistenciaYPreguntasClase.push(
          this.getAsistenciaYPreguntas(
            clase,
            alumno,
            preguntasAnonimas.subCollection
          )
        );

        respuestasPromise.push(
          this.getRespuestasAPreguntasDeClase(
            clase,
            alumno,
            respuestas,
            preguntasConRespuestas
          )
        );
      });
    }

    let respuestasPreguntasDeClase = await Promise.all(respuestasPromise);
    let openData = [];
    asistenciaYPreguntasClase = groupBy(asistenciaYPreguntasClase, 'user');
    asistenciaYPreguntasClase = Object.entries(asistenciaYPreguntasClase).map(
      (elem) => {
        openData.push(false);
        return { id: elem[0], data: elem[1] };
      }
    );

    let openDataRespuestas = [];
    respuestasPreguntasDeClase = groupBy(respuestasPreguntasDeClase, 'user');
    respuestasPreguntasDeClase = Object.entries(respuestasPreguntasDeClase).map(
      (elem) => {
        openDataRespuestas.push(false);
        return { id: elem[0], data: elem[1] };
      }
    );

    this.setState({
      asistenciaYPreguntasClase,
      openAsistenciaYPreguntas: openData,
      respuestasPreguntasDeClase,
      openRespuestasPreguntasDeClase: openDataRespuestas,
      isLoading: false,
    });
  };

  getRespuestasAPreguntasDeClase = async (
    clase,
    alumno,
    respuestas,
    preguntasConRespuestas
  ) => {
    const respuestasDeAlumno = respuestas.filter(
      (rta) => rta.data.idClase === clase.id && rta.data.idAlumno === alumno.id
    );
    const cantDocumentosDeRespuestasDeAlumno = respuestasDeAlumno.length;

    if (cantDocumentosDeRespuestasDeAlumno > 0) {
      const cantPreguntasDeClase = preguntasConRespuestas.length;
      let cantPreguntasNoRespondidas = 0;
      for (const pregunta of preguntasConRespuestas) {
        // verifico si el alumno respondio la pregunta
        const alumnoRespondio = pregunta.data.subcollections.some(
          (preg) => preg.id === alumno.id
        );
        if (!alumnoRespondio) cantPreguntasNoRespondidas++;
      }

      let respondioOk = 0;
      let respondioMal = 0;
      let noSupoRespuesta = 0;
      let cantRespuestasNetasAlumno = 0;
      for (const respuesta of respuestasDeAlumno) {
        //No sabe la rta
        if (respuesta.data.respuestas.length === 0) {
          noSupoRespuesta++;
          cantRespuestasNetasAlumno++;
        } else {
          //Respondio algo (bien o mal)
          for (let i = 0; i < respuesta.data.respuestas.length; i++) {
            cantRespuestasNetasAlumno++;
            const respuestaOk = respuesta.data.opcionesVerdaderas.includes(
              respuesta.data.respuestas[i]
            );
            if (respuestaOk) respondioOk++;
            else respondioMal++;
          }
        }
      }
      return {
        id: clase.id,
        user: alumno.nombre,
        nombreClase: clase.nombre,
        fecha: clase.fecha,
        respondioOk: respondioOk,
        respondioMal: respondioMal,
        noSupoRespuesta: noSupoRespuesta,
        cantidadRespuestasAlumno: cantRespuestasNetasAlumno,
        cantPreguntasNoRespondidas: cantPreguntasNoRespondidas,
        cantPreguntasDeClase: cantPreguntasDeClase,
      };
    } else {
      //devolver clase y todo null, ya que no hay rtas para esa clase
      return {
        id: clase.id,
        user: alumno.nombre,
        nombreClase: clase.nombre,
        fecha: clase.fecha,
        respondioOk: null,
        respondioMal: null,
        sabeRta: null,
        cantidadRespuestasAlumno: null,
        cantPreguntasNoRespondidas: null,
        cantPreguntasDeClase: null,
      };
    }
  };

  getAsistenciaYPreguntas(clase, usuario, preguntasAnonimas) {
    const preguntasAlumno =
      preguntasAnonimas.length > 0
        ? preguntasAnonimas.filter(
            (pregunta) => pregunta.data.creador === usuario.id
          )
        : [];

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
          preguntas: preguntasAlumno.length,
          user: usuario.nombre,
          nombreClase: clase.nombre,
          fecha: clase.fecha,
        };
      }
    }
    return {
      id: clase.id,
      tiempo: 0,
      preguntas: preguntasAlumno.length,
      user: usuario.nombre,
      nombreClase: clase.nombre,
      fecha: clase.fecha,
    };
  }

  render() {
    const {
      asistenciaYPreguntasClase,
      openAsistenciaYPreguntas,
      respuestasPreguntasDeClase,
      openRespuestasPreguntasDeClase,
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
          <h2 className="titulo-asistencia">
            Asistencia y Preguntas en Clases
          </h2>
        </Row>
        {isEmpty(asistenciaYPreguntasClase) && (
          <span>No hay datos sobre asistencia y preguntas en clases</span>
        )}
        {!isEmpty(asistenciaYPreguntasClase) && (
          <TableContainer component={Paper}>
            {asistenciaYPreguntasClase.map((row, index) => (
              <Fragment key={index}>
                <TableRow className="mb-2">
                  <TableCell className="button-toggle">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() => this.toggleAccordion(index)}
                    >
                      {openAsistenciaYPreguntas ? (
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
                    <Collapse
                      in={openAsistenciaYPreguntas[index]}
                      timeout="auto"
                    >
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
                                  {historyRow.preguntas === 0
                                    ? 'Sin preguntas'
                                    : historyRow.preguntas}
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
          <h2 className="titulo-asistencia">
            Respuestas a Preguntas Lanzadas en Clases
          </h2>
        </Row>
        {isEmpty(respuestasPreguntasDeClase) && (
          <span>
            No hay datos sobre respuestas de alumnos a preguntas lanzadas en
            clases
          </span>
        )}
        {!isEmpty(respuestasPreguntasDeClase) && (
          <TableContainer component={Paper}>
            {respuestasPreguntasDeClase.map((row, index) => (
              <Fragment key={index}>
                <TableRow className="mb-2">
                  <TableCell className="button-toggle">
                    <IconButton
                      aria-label="expand row"
                      size="small"
                      onClick={() =>
                        this.toggleAccordionRespuestasDeAlumnos(index)
                      }
                    >
                      {openRespuestasPreguntasDeClase ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowUpIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell
                    className="width-100 font-weight-bold"
                    onClick={() =>
                      this.toggleAccordionRespuestasDeAlumnos(index)
                    }
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
                    <Collapse
                      in={openRespuestasPreguntasDeClase[index]}
                      timeout="auto"
                    >
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
                              <TableCell className="font-weight-bold reporte-respuestas">
                                Opciones Correctas
                              </TableCell>
                              <TableCell className="font-weight-bold reporte-respuestas">
                                Opciones Incorrectas
                              </TableCell>
                              <TableCell className="font-weight-bold reporte-respuestas">
                                Respuestas que no sabe
                              </TableCell>
                              <TableCell className="font-weight-bold reporte-respuestas">
                                Preguntas No Respondidas
                              </TableCell>
                              <TableCell className="font-weight-bold reporte-respuestas">
                                Cantidad Total de Preguntas de la clase
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.data.map((historyRow) => (
                              <TableRow key={historyRow.id}>
                                <TableCell component="th" scope="row">
                                  {historyRow.nombreClase}
                                </TableCell>
                                <TableCell>
                                  {getDateTimeStringFromDate(historyRow.fecha)}
                                </TableCell>
                                <TableCell className="reporte-respuestas">
                                  {historyRow.respondioOk ?? '-'}
                                </TableCell>
                                <TableCell className="reporte-respuestas">
                                  {historyRow.respondioMal ?? '-'}
                                </TableCell>
                                <TableCell className="reporte-respuestas">
                                  {historyRow.noSupoRespuesta ?? '-'}
                                </TableCell>
                                <TableCell className="reporte-respuestas">
                                  {historyRow.cantPreguntasNoRespondidas ?? '-'}
                                </TableCell>
                                <TableCell className="reporte-respuestas">
                                  {historyRow.cantPreguntasDeClase ?? '-'}
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
