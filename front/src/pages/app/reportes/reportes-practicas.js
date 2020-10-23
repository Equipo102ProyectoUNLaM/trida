import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import { groupBy } from 'lodash';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import { getCollection, getDocument } from 'helpers/Firebase-db';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class ReportesPracticas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataPracticas: [],
    };
  }

  componentDidMount() {
    this.getCorreccionesDePracticas();
  }

  getNombreUsuario = async (id) => {
    const { data } = await getDocument(`usuarios/${id}`);
    return data.nombre + ' ' + data.apellido;
  };

  getNombrePractica = async (id) => {
    const { data } = await getDocument(`practicas/${id}`);
    return data.nombre;
  };

  getCorreccionesDePracticas = async () => {
    const data = await getCollection('correcciones', [
      {
        field: 'tipo',
        operator: '==',
        id: 'practica',
      },
      { field: 'idMateria', operator: '==', id: this.props.subject.id },
      { field: 'estado', operator: '==', id: 'Corregido' },
    ]);

    const dataPracticasPromise = data.map(async (elem) => {
      return {
        id: elem.id,
        idPractica: elem.data.idPractica,
        nombrePractica: await this.getNombrePractica(elem.data.idPractica),
        idUsuario: elem.data.idUsuario,
        nombreUsuario: await this.getNombreUsuario(elem.data.idUsuario),
        estado: elem.data.estadoCorreccion,
        nota: elem.data.notaCorreccion,
      };
    });

    let dataPracticas = await Promise.all(dataPracticasPromise);
    dataPracticas = groupBy(dataPracticas, 'nombreUsuario');
    dataPracticas = Object.entries(dataPracticas).map((elem) => {
      return { id: elem[0], data: elem[1] };
    });
    this.setState({ dataPracticas });
  };

  render() {
    const { dataPracticas } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.practicas" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        {/*  <Row>
          <Row className="display-row" xs="1" sm="2" md="4">
            <Col>Alumno</Col>
            <Col>Práctica</Col>
            <Col>Estado</Col>
            <Col>Nota</Col>
          </Row>
          {dataPracticas.map((elem) => {
            return (
              <Container key={elem.id}>
                <Row className="display-row">
                  <Col>{elem.id}</Col>
                  {elem.data.map((data) => {
                    return (
                      <Row className="display-row" key={data.id}>
                        <Col>{data.nombrePractica}</Col>
                        <Col>{data.estado}</Col>
                        <Col>{data.nota}</Col>
                      </Row>
                    );
                  })}
                </Row>
              </Container>
            );
          })}
        </Row> */}
        <Separator />
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Alumno</TableCell>
                <TableCell align="right">Práctica</TableCell>
                <TableCell align="right">Estado</TableCell>
                <TableCell align="right">Nota</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataPracticas.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  {row.data.map((data) => {
                    return (
                      <>
                        <TableCell colSpan={2} align="right">
                          {data.nombrePractica}
                        </TableCell>
                        <TableCell colSpan={2} align="right">
                          {data.estado}
                        </TableCell>
                        <TableCell colSpan={2} align="right">
                          {data.nota}
                        </TableCell>
                      </>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(ReportesPracticas);
