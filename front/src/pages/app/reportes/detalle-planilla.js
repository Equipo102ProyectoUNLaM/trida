import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card, Tooltip } from 'reactstrap';
import { Separator } from 'components/common/CustomBootstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import moment from 'moment';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import { createRandomString, getFechaHoraActual, getDate } from 'helpers/Utils';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { isEmpty } from 'helpers/Utils';
import {
  enviarNotificacionError,
  enviarNotificacionExitosa,
} from 'helpers/Utils-ui';
import {
  addDocumentWithId,
  editDocument,
  deleteDocument,
  addDocument,
} from 'helpers/Firebase-db';
import { getDocument, getCollection } from 'helpers/Firebase-db';

export const Columna = ({
  data,
  colData,
  borrarColumna,
  agregarAColumna,
  cambiarNombreColumna,
}) => {
  const [tooltipOpen, setTooltip] = useState(false);

  const handleChange = (colId, userId, event) => {
    const { value } = event.target;
    const obj = { userId, valor: value };
    agregarAColumna(colId, obj);
  };

  const handleNombreChange = (colId, event) => {
    const { value } = event.target;
    cambiarNombreColumna(colId, value);
  };

  return (
    <Col className="mr-2 ml-1 flex justify-center">
      <div className="flex align-baseline justify-between w-100 no-wrap">
        <div></div>
        <Input
          defaultValue={colData.data.nombre}
          className="mb-4 input-20-2 align-center header-small padding-0"
          autoComplete="off"
          name="tema"
          onChange={(event) => handleNombreChange(colData.id, event)}
        />
        <div>
          <i
            className="simple-icon-trash borrar-columna cursor-pointer ml-1"
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
      {!isEmpty(colData.data.valores) &&
        colData.data.valores.map((data) => (
          <>
            <Input
              defaultValue={data.valor}
              className="mb-1 input-20 align-center padding-0"
              key={data.userId}
              autoComplete="off"
              name="tema"
              onChange={(event) => handleChange(colData.id, data.userId, event)}
            />
          </>
        ))}
      {isEmpty(colData.data.valores) &&
        data.map((data) => (
          <>
            <Input
              defaultValue=""
              className="mb-1 input-20 align-center"
              key={data.id}
              autoComplete="off"
              name="tema"
              onChange={(event) => handleChange(colData.id, data.id, event)}
            />
          </>
        ))}
    </Col>
  );
};

class DetallePlanilla extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alumnosData: [],
      columnas: [],
      inputAgregarColumna: false,
      nombreColumna: '',
      isLoading: true,
      idPlanilla: this.props.history.location.pathname.split('/')[4],
      nombrePlanilla: '',
      confirmarGuardar: false,
    };
  }

  componentDidMount() {
    this.getAlumnos();
    this.getDatosPlanilla();
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

  getDatosPlanilla = async () => {
    this.setState({
      isLoading: true,
    });
    const planilla = await getDocument(
      `planillasDocente/${this.props.user}/planillas/${this.state.idPlanilla}`
    );
    const columnas = await getCollection(
      `planillasDocente/${this.props.user}/planillas/${this.state.idPlanilla}/columnas`
    );
    this.setState({
      nombrePlanilla: planilla.data.nombre,
      columnas,
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

  handleNombrePlanillaChange = (event) => {
    this.setState({
      nombrePlanilla: event.target.value,
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
        data: { nombre: this.state.nombreColumna, valores: [] },
      });
      this.setState({
        columnas,
      });
    }
    this.toggleAgregarColumna();
  };

  agregarAColumna = (col, obj) => {
    let columnas = [...this.state.columnas];
    const [columna] = columnas.filter((columna) => columna.id === col);

    const [colUsuario] = columna.data.valores.filter(
      (colUsuario) => colUsuario.userId === obj.userId
    );

    if (isEmpty(colUsuario)) {
      columna.data.valores.push(obj);
    } else {
      colUsuario.valor = obj.valor;
    }
  };

  borrarColumna = (id) => {
    let columnas = [...this.state.columnas];

    columnas = columnas.filter((col) => col.id !== id);
    this.setState({
      columnas,
    });
  };

  cambiarNombreColumna = (colId, nombre) => {
    let columnas = [...this.state.columnas];
    const [columna] = columnas.filter((columna) => columna.id === colId);
    columna.data.nombre = nombre;
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

  toggleConfirmarGuardar = () => {
    this.setState({ confirmarGuardar: !this.state.confirmarGuardar });
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

  guardarPlanilla = async (overwrite) => {
    const { columnas, idPlanilla, nombrePlanilla } = this.state;

    if (overwrite) {
      await editDocument(
        `planillasDocente/${this.props.user}/planillas`,
        idPlanilla,
        { nombre: nombrePlanilla }
      );

      const columnasInCollection = await getCollection(
        `planillasDocente/${this.props.user}/planillas/${idPlanilla}/columnas`
      );
      for (const colum of columnasInCollection) {
        await deleteDocument(
          `planillasDocente/${this.props.user}/planillas/${idPlanilla}/columnas`,
          colum.id
        );
      }
    } else {
      let docRef = await addDocument(
        `planillasDocente/${this.props.user}/planillas`,
        { nombre: nombrePlanilla },
        this.props.user
      );

      this.setState({ idPlanilla: docRef.id }, () => console.log());
    }

    for (const columna of columnas) {
      await addDocumentWithId(
        `planillasDocente/${this.props.user}/planillas/${this.state.idPlanilla}/columnas`,
        columna.id,
        { nombre: columna.data.nombre, valores: columna.data.valores }
      );
    }

    enviarNotificacionExitosa(
      'Planilla guardada exitosamente',
      'Planilla Guardada!'
    );

    this.toggleConfirmarGuardar();
    if (!overwrite) {
      this.props.history.push(
        `/app/reportes/mi-planilla-guardada/${this.state.idPlanilla}`
      );
    }
  };

  render() {
    const {
      alumnosData,
      columnas,
      inputAgregarColumna,
      isLoading,
      nombrePlanilla,
      confirmarGuardar,
    } = this.state;

    return (
      <div>
        {(isLoading || isEmpty(alumnosData)) && <div className="cover-spin" />}
        <HeaderDeModulo
          heading="menu.mi-reporte"
          toggleModal={() =>
            this.props.history.push('/app/reportes/mis-planillas-guardadas')
          }
          buttonText="menu.reportes-guardados"
        />
        <Row className="row-acciones button-group mt-2 justify-between align-baseline">
          <div className="form-group has-float-label">
            <Input
              defaultValue={nombrePlanilla}
              onChange={this.handleNombrePlanillaChange}
              autoComplete="off"
              name="nombrePlanilla"
              className="input-nombre-columna"
              placeholder="Nombre de planilla (requerido para guardar)"
            />
            <span>Nombre de Planilla *</span>
          </div>
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
                onClick={this.toggleConfirmarGuardar}
                color="primary"
                className="button"
                disabled={!nombrePlanilla}
              >
                GUARDAR
              </Button>
            </div>
          )}
          {inputAgregarColumna && (
            <div className="div-acciones">
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
            </div>
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
                <div className="flex justify-between w-100 height-fixed margin-top-05">
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
                  agregarAColumna={this.agregarAColumna}
                  cambiarNombreColumna={this.cambiarNombreColumna}
                />
              ))}
            </Card>
          </Grid>
        </div>
        {confirmarGuardar && (
          <ModalConfirmacion
            isOpen={confirmarGuardar}
            toggle={this.toggleConfirmarGuardar}
            titulo="Guardar"
            texto="¿Querés sobreescribir tu planilla o guardar una nueva?"
            buttonSecondary="Cancelar"
            buttonPrimary="Guardar Nuevo"
            buttonOverwrite="Sobreescribir"
            onConfirm={() => this.guardarPlanilla(false)}
            onOverwrite={() => this.guardarPlanilla(true)}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject, course, institution } = seleccionCurso;
  const { user } = authUser;
  return { subject, course, institution, user };
};

export default connect(mapStateToProps)(DetallePlanilla);
