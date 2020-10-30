import React, { Component, Fragment } from 'react';
import { Input, Button } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import { createRandomString } from 'helpers/Utils';

export const Columna = ({ data, colData, borrarColumna }) => {
  return (
    <Col>
      <span>{colData.nombre}</span>
      {data.map((data) => (
        <>
          <Input key={colData.id} autoComplete="off" name="tema" />
        </>
      ))}
      <Button onClick={() => borrarColumna(colData.id)}>Borrar</Button>
    </Col>
  );
};

export default class MiReporte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alumnosData: ['test1', 'test2', 'test3'],
      columnas: [],
      inputAgregarColumna: false,
      nombreColumna: '',
    };
  }

  toggleAgregarColumna = () => {
    this.setState({
      inputAgregarColumna: !this.state.inputAgregarColumna,
      nombreColumna: '',
    });
  };

  handleChange = (event) => {
    this.setState({
      nombreColumna: event.target.value,
    });
  };

  onAgregarColumna = () => {
    let columnas = [...this.state.columnas];

    columnas.push({
      id: createRandomString(),
      nombre: this.state.nombreColumna,
    });
    this.setState({
      columnas,
    });
    this.toggleAgregarColumna();
  };

  borrarColumna = (id) => {
    let columnas = [...this.state.columnas];

    columnas = columnas.filter((col) => col.id !== id);
    this.setState({
      columnas,
    });
  };

  render() {
    const { alumnosData, columnas, inputAgregarColumna } = this.state;
    return (
      <>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.mi-reporte" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Button onClick={this.toggleAgregarColumna}>Agregar Columna</Button>
        {inputAgregarColumna && (
          <>
            <Input
              onChange={this.handleChange}
              autoComplete="off"
              name="nombreCol"
            />
            <Button onClick={this.onAgregarColumna}>Confirmar</Button>
            <Button onClick={this.toggleAgregarColumna}>Cancelar</Button>
          </>
        )}
        <Grid className="flex">
          <Col>
            Alumnos
            {alumnosData.map((alumno) => (
              <Row key={alumno}>{alumno}</Row>
            ))}
          </Col>
          {columnas.map((columna) => (
            <Columna
              key={columna.id}
              data={alumnosData}
              colData={columna}
              borrarColumna={this.borrarColumna}
            />
          ))}
        </Grid>
      </>
    );
  }
}
