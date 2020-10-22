import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import { getCollection, getDocument } from 'helpers/Firebase-db';

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

    const dataPracticas = await Promise.all(dataPracticasPromise);
    this.setState({ dataPracticas });
    console.log(dataPracticas);
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
        <Row>
          {dataPracticas.map((elem) => {
            return (
              <Row key={elem.id}>
                <Col>{elem.nombrePractica} </Col>
                <Col>{elem.nombreUsuario} </Col>
                <Col>{elem.estado} </Col>
                <Col>{elem.nota} </Col>
                <br />
              </Row>
            );
          })}
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(ReportesPracticas);
