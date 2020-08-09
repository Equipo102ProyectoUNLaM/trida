import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getCollection, getDocument } from 'helpers/Firebase-db';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Detail extends React.Component {
  static propTypes = {
    file: PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      extension: PropTypes.string.isRequired,
      url: PropTypes.string,
    }).isRequired,
    close: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      isLoading: true,
      subjectId: id,
      alumno: '',
      estado: '',
      fecha_entrega: '',
      fecha_vto_entrega: '',
      modalRight: true,
      tipo_entrega: '',
    };
  }

  toggleRight = () => {
    this.setState((prevState) => ({
      modalRight: !prevState.modalRight,
    }));
  };

  componentDidMount() {
    this.loadingOn();
    this.setInitialState();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.file.key !== this.props.file.key) {
      this.loadingOn();
      this.toggleRight();
      this.setInitialState();
    }
  }

  setInitialState = async () => {
    const keyFile = this.getKeyFile();
    const correccion = await this.getCorreccion(keyFile);
    this.setEstadoFechaYTipo(correccion);
    this.setFechaVtoEntrega(correccion);
    this.getAlumno(correccion.id_alumno);
  };

  /* Esta funcion se encarga de obtener la key "idUsuario-nombreCorreccion" a partir del campo URL */
  getKeyFile() {
    const busquedaIni = '%2Fcorrecciones%2F';
    const longbusquedaIni = busquedaIni.length;
    const busquedaFin = '?alt';
    const url = this.props.file.url;
    return url.substring(
      url.lastIndexOf(busquedaIni) + longbusquedaIni,
      url.lastIndexOf(busquedaFin)
    );
  }

  getCorreccion = async (keyFile) => {
    const correccion = await getCollection('correcciones', [
      { field: 'key', operator: '==', id: keyFile },
      { field: 'id_materia', operator: '==', id: this.state.subjectId },
    ]);

    return correccion[0].data;
  };

  getAlumno = async (idAlumno) => {
    const alumnoObj = await getDocument(`usuarios/${idAlumno}`);
    const { nombre, apellido } = alumnoObj.data;
    this.setState({
      alumno: nombre + ' ' + apellido,
    });
    this.loadingOff();
  };

  handleCloseClick = (event) => {
    if (event) {
      event.preventDefault();
    }
    this.props.close();
    this.toggleRight();
  };

  setEstadoFechaYTipo(correccion) {
    this.setState({
      estado: correccion.estado,
      fecha_entrega: correccion.fecha_entrega,
      tipo_entrega: correccion.tipo,
    });
  }

  setFechaVtoEntrega(correccion) {
    if (correccion.tipo === 'practica') {
      this.getFechaPractica(correccion.id_entrega);
    } else if (correccion.tipo === 'evaluacion') {
      this.getFechaEvaluacion(correccion.id_entrega);
    }
  }

  getFechaPractica = async (idPractica) => {
    const practicaObj = await getDocument(`practicas/${idPractica}`);
    this.setState({
      fecha_vto_entrega: practicaObj.data.fechaVencimiento,
    });
  };

  getFechaEvaluacion = async (idEvaluacion) => {
    const evalObj = await getDocument(`practicas/${idEvaluacion}`);
    this.setState({
      fecha_vto_entrega: evalObj.data.fecha_finalizacion,
    });
  };

  loadingOn() {
    this.setState({
      isLoading: true,
    });
  }

  loadingOff() {
    this.setState({
      isLoading: false,
    });
  }

  goToCorreccion = (event) => {
    alert('Acá escribir la función que lleve a la corrección');
  };

  render() {
    let name = this.props.file.key.split('/');
    name = name.length ? name[name.length - 1] : '';
    const {
      isLoading,
      alumno,
      estado,
      fecha_entrega,
      fecha_vto_entrega,
      tipo_entrega,
    } = this.state;

    return (
      <Fragment>
        {isLoading ? <div id="cover-spin"></div> : <span></span>}
        <div className="item-detail">
          <Modal
            isOpen={this.state.modalRight}
            toggle={this.toggleRight}
            wrapClassName="modal-right"
          >
            <ModalHeader toggle={this.toggleRight}>
              Detalle de la corrección
            </ModalHeader>
            <ModalBody>
              <dl>
                <dt>Nombre del archivo</dt>
                <dd>{this.props.file.key}</dd>
                <dt>Alumno </dt>
                <dd>{alumno}</dd>
                <dt>Estado </dt>
                <dd>{estado}</dd>
                <dt>Tipo de Entrega </dt>
                <dd>{tipo_entrega}</dd>
                <dt>Fecha Entrega </dt>
                <dd>{fecha_entrega}</dd>
                <dt>Fecha Vencimiento de la Entrega </dt>
                <dd>{fecha_vto_entrega}</dd>
              </dl>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.goToCorreccion}>
                CORREGIR
              </Button>{' '}
              <Button color="secondary" onClick={this.handleCloseClick}>
                SALIR
              </Button>
            </ModalFooter>
          </Modal>
          {/*           
          <h2>Detalle de la corrección</h2>
          <dl className="row-detail-correcciones">
            <dt>Nombre del archivo</dt>
            <dd>{this.props.file.key}</dd>
            {('props', console.log(this.props))}
            <dt>Alumno </dt>
            <dd>{alumno}</dd>
            <dt>Estado </dt>
            <dd>{estado}</dd>
            <dt>Fecha Entrega </dt>
            <dd>{fecha_entrega}</dd>
            <dt>Fecha Vencimiento de la Entrega </dt>
            <dd>{fecha_vto_entrega}</dd>
          </dl>
          <div className="actions-detail-correcciones">
            <a href="#" onClick={this.handleCloseClick}>
              CERRAR
            </a>
            <a href="#" onClick={this.goToCorreccion}>
              CORREGIR
            </a>
          </div>

  */}
        </div>
      </Fragment>
    );
  }
}

export default Detail;
