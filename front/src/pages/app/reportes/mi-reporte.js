import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import { createRandomString } from 'helpers/Utils';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const Columna = ({ data, colData, borrarColumna }) => {
  return (
    <Card className="no-width pr-1">
      <Col className="mr-2 ml-1 flex justify-center">
        <span className="mb-2 header">{colData.nombre}</span>
        {data.map((data) => (
          <>
            <Input
              className="mb-2"
              key={colData.id}
              autoComplete="off"
              name="tema"
              placeholder="Ingrese un valor"
            />
          </>
        ))}
        <i
          className="iconsminds-close borrar-columna"
          onClick={() => borrarColumna(colData.id)}
          id={'borrar-columna' + colData.id}
        />
      </Col>
    </Card>
  );
};

class MiReporte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alumnosData: ['test1', 'test2', 'test3'],
      columnas: [],
      inputAgregarColumna: false,
      nombreColumna: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getAlumnos();
  }

  getAlumnos = async () => {
    const alumnosData = await getUsuariosAlumnosPorMateria(
      this.props.subject.id
    );
    this.setState({
      alumnosData,
      isLoading: false,
    });
  };

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

    if (this.state.nombreColumna) {
      columnas.push({
        id: createRandomString(),
        nombre: this.state.nombreColumna,
      });
      this.setState({
        columnas,
      });
    }
    this.toggleAgregarColumna();
  };

  borrarColumna = (id) => {
    let columnas = [...this.state.columnas];

    columnas = columnas.filter((col) => col.id !== id);
    this.setState({
      columnas,
    });
  };

  toggleIconoBorrar = (style) => {
    const { columnas } = this.state;

    columnas.forEach((col) => {
      const x = document.getElementById('borrar-columna' + col.id);

      if (x) {
        x.style.visibility = style;
      }
    });
  };

  exportarPdf = async () => {
    this.setState({ isLoading: true });
    this.toggleIconoBorrar('hidden');

    const encabezado = document.getElementById('encabezadoAImprimir');

    await html2canvas(encabezado, {
      scale: 0.9,
      scrollY: -window.scrollY,
      useCORS: true,
    }).then(async (canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');

      /*Calculo de paginado */
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;
      var position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('reporte.pdf');
      this.toggleIconoBorrar('visible');
      this.setState({ isLoading: false });
    });
  };

  render() {
    const {
      alumnosData,
      columnas,
      inputAgregarColumna,
      isLoading,
    } = this.state;

    return isLoading ? (
      <div className="cover-spin" />
    ) : (
      <div>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.mi-reporte" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="flex mb-2 align-center flex-end">
          {!inputAgregarColumna && (
            <div className="button-group">
              <Button
                color="primary"
                onClick={this.toggleAgregarColumna}
                className="button"
              >
                AGREGAR COLUMNA
              </Button>
              <Button
                onClick={this.exportarPdf}
                color="primary"
                className="button"
              >
                EXPORTAR PDF
              </Button>
            </div>
          )}
          {inputAgregarColumna && (
            <>
              <Input
                onChange={this.handleChange}
                autoComplete="off"
                name="nombreCol"
                className="input-columna"
                placeholder="Ingrese nombre de columna"
              />
              <div className="icon-columna">
                <i
                  className="iconsminds-yes cursor-pointer secondary"
                  onClick={this.onAgregarColumna}
                />
                <i
                  className="iconsminds-close cursor-pointer primary"
                  onClick={this.toggleAgregarColumna}
                />
              </div>
            </>
          )}
        </Row>
        <Grid id="encabezadoAImprimir" className="flex container">
          <Card className="no-width ml-0 pr-4">
            <Col className="mb-2 pl-3">
              <div className="flex justify-center">
                <span className="header">Alumnos</span>
              </div>
              {alumnosData.map((alumno) => (
                <Row className="col-alumno" key={alumno.id}>
                  {alumno.nombre}
                </Row>
              ))}
            </Col>
          </Card>
          {columnas.map((columna) => (
            <Columna
              key={columna.id}
              data={alumnosData}
              colData={columna}
              borrarColumna={this.borrarColumna}
            />
          ))}
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(MiReporte);
