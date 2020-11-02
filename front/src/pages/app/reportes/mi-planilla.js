import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card, Tooltip } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import moment from 'moment';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { createRandomString, getFechaHoraActual, getDate } from 'helpers/Utils';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { enviarNotificacionError } from 'helpers/Utils-ui';

export const Columna = ({ data, colData, borrarColumna }) => {
  const [tooltipOpen, setTooltip] = useState(false);
  return (
    <Col className="mr-2 ml-1 flex justify-center">
      <div className="flex align-center justify-between w-100">
        <div></div>
        <span className="mb-2 mt-2 header-max truncate">
          {colData.nombre}{' '}
        </span>{' '}
        <div>
          <i
            className="simple-icon-trash borrar-columna cursor-pointer"
            onClick={() => borrarColumna(colData.id)}
            id={'borrar-columna' + colData.id}
          />
          <Tooltip
            placement="right"
            isOpen={tooltipOpen}
            target={'borrar-columna' + colData.id}
            toggle={() => setTooltip(!tooltipOpen)}
          >
            Borrar Columna
          </Tooltip>
        </div>
      </div>
      {data.map((data) => (
        <>
          <Input
            className="mb-1 input-20 align-center"
            key={colData.id}
            autoComplete="off"
            name="tema"
          />
        </>
      ))}
    </Col>
  );
};

class MiReporte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alumnosData: [],
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
    if (this.state.columnas.length < 10) {
      this.setState({
        inputAgregarColumna: !this.state.inputAgregarColumna,
        nombreColumna: '',
      });
    } else {
      enviarNotificacionError(
        'No se pueden agregar mas de 10 columnas',
        'Ups!'
      );
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
    const { columnas } = this.state;
    const landscape = columnas.length > 6;

    this.setState({ isLoading: true });
    this.toggleIconoBorrar('hidden', 'block', 'visible');

    const encabezado = document.getElementById('encabezadoAImprimir');

    await html2canvas(encabezado, {
      scale: 0.9,
      scrollY: -window.scrollY,
      useCORS: true,
    }).then(async (canvas) => {
      let pdf = '';
      landscape ? (pdf = new jsPDF('l')) : (pdf = new jsPDF());

      const imgData = canvas.toDataURL('image/png');

      /*Calculo de paginado */
      var imgWidth = landscape ? 295 : 210;
      var pageHeight = landscape ? 210 : 295;
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

  guardarPlanilla = () => {
    console.log('guardar');
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
        <HeaderDeModulo
          heading="menu.mi-reporte"
          toggleModal={() =>
            this.props.history.push('/app/reportes/mis-planillas-guardadas')
          }
          buttonText="menu.reportes-guardados"
        />
        <Row className="row-acciones button-group mt-2">
          {!inputAgregarColumna && (
            <div className="button-group">
              <Button
                outline
                color="secondary"
                onClick={this.toggleAgregarColumna}
                className="button"
              >
                AGREGAR COLUMNA
              </Button>
              <Button
                outline
                onClick={this.exportarPdf}
                color="primary"
                className="button"
              >
                EXPORTAR PDF
              </Button>
              <Button
                outline
                onClick={this.guardarPlanilla}
                color="primary"
                className="button"
              >
                GUARDAR
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
              <Col className="mb-2 pl-3 min-width truncate">
                <div className="flex align-center justify-between w-100 height-fixed">
                  <span className="header">Alumnos</span>
                </div>
                {alumnosData.map((alumno) => {
                  return (
                    <>
                      <Row
                        id={'nombre-alumno' + alumno.id}
                        className="col-alumno truncate"
                        key={alumno.id}
                      >
                        {alumno.nombre}
                      </Row>
                      <Separator className="margin-top-bottom" />
                    </>
                  );
                })}
              </Col>
              {columnas.map((columna) => (
                <Columna
                  key={columna.id}
                  data={alumnosData}
                  colData={columna}
                  borrarColumna={this.borrarColumna}
                />
              ))}
            </Card>
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
