import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import moment from 'moment';
import Breadcrumb from 'containers/navegacion/Breadcrumb';
import { createRandomString, getFechaHoraActual, getDate } from 'helpers/Utils';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { enviarNotificacionError } from 'helpers/Utils-ui';

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
            <Separator />
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
    if (this.state.columnas.length < 6) {
      this.setState({
        inputAgregarColumna: !this.state.inputAgregarColumna,
        nombreColumna: '',
      });
    } else {
      enviarNotificacionError('No se pueden agregar mas de 6 columnas', 'Ups!');
    }
  };

  handleChange = (event) => {
    this.setState({
      nombreColumna: event.target.value,
    });
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.onAgregarColumna();
    }
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

  toggleIconoBorrar = (visibility, display, overflow) => {
    const { columnas, alumnosData } = this.state;

    const y = document.getElementById('datos-materia');
    if (y) y.style.display = display;

    columnas.forEach((col) => {
      const x = document.getElementById('borrar-columna' + col.id);

      if (x) {
        x.style.visibility = visibility;
      }
    });

    alumnosData.forEach((alu) => {
      const x = document.getElementById('nombre-alumno' + alu.id);
      if (x) {
        x.style.overflow = overflow;
      }
    });
  };

  exportarPdf = async () => {
    this.setState({ isLoading: true });
    this.toggleIconoBorrar('hidden', 'block', 'visible');

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

      pdf.save(
        `MiPlanilla-${this.props.subject.name}-${
          this.props.course.name
        }-${moment().format('DD-MM-YYYY')}`
      );
      this.toggleIconoBorrar('visible', 'none', 'scroll');
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
                onKeyPress={this.handleKeyPress}
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
        <div id="encabezadoAImprimir">
          <div id="datos-materia" className="hidden pl-4 pt-4 mt-4">
            <h2>Mi Planilla</h2>
            <span>Fecha: {getFechaHoraActual()}</span>
            <br />
            <span>
              Materia: {this.props.subject.name} - {this.props.course.name} -{' '}
              {this.props.institution.name}
            </span>
            <br />
            <br />
          </div>
          <Grid className="flex container">
            <Card className="no-width ml-0 pr-4">
              <Col className="mb-2 pl-3">
                <div className="flex justify-center">
                  <span className="header">Alumnos</span>
                </div>
                {alumnosData.map((alumno) => (
                  <>
                    <Row
                      id={'nombre-alumno' + alumno.id}
                      className="col-alumno truncate"
                      key={alumno.id}
                    >
                      {alumno.nombre}
                    </Row>
                    <Separator className="mt-1" />
                  </>
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
      </div>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject, course, institution } = seleccionCurso;
  return { subject, course, institution };
};

export default connect(mapStateToProps)(MiReporte);
