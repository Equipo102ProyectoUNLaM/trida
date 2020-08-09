import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getCollection, getDocument } from 'helpers/Firebase-db';

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
    };
  }

  componentDidMount = async () => {
    const keyFile = this.getKeyFile();
    const correccion = await this.getCorreccion(keyFile);
    this.setEstadoYFecha(correccion);
    this.setFechaVtoEntrega(correccion);
    this.getAlumno(correccion.id_alumno);
  };

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
      isLoading: false,
    });
  };

  handleCloseClick = (event) => {
    if (event) {
      event.preventDefault();
    }
    this.props.close();
  };

  setEstadoYFecha(correccion) {
    this.setState({
      estado: correccion.estado,
      fecha_entrega: correccion.fecha_entrega,
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

  //REVISAR
  getFechaEvaluacion = async (idEvaluacion) => {
    const evalObj = await getDocument(`practicas/${idEvaluacion}`);
    this.setState({
      fecha_vto_entrega: evalObj.data.fecha_finalizacion,
    });
  };

  probando = (event) => {
    alert('Hola');
    console.log('Hola');
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
    } = this.state;

    return (
      <Fragment>
        {isLoading ? <div id="cover-spin"></div> : <span></span>}
        <div className="item-detail">
          <h2>Detalle de la corrección</h2>
          <dl>
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
          <a href="#" onClick={this.probando}>
            Probando
          </a>
          <a href="#" onClick={this.handleCloseClick}>
            Close
          </a>
        </div>
      </Fragment>
    );
  }
}

export default Detail;
