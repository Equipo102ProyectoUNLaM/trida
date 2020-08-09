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
      fullKey: PropTypes.string,
    }).isRequired,
    //fullKey: PropTypes.string,
    close: PropTypes.func,
  };

  constructor(props) {
    super(props);
    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      file: 'mjQtdNYdRKMqZ3aty4NKBh7ZXjG2-00---Presentacion-de-la-materia1.pdf',
      isLoading: true,
      subjectId: id,
      alumno: '',
    };
  }

  componentDidMount = async () => {
    const correccion = await this.getCorreccion();
    this.getAlumno(correccion[0].data.id_alumno);
  };

  getCorreccion = async () => {
    return await getCollection('correcciones', [
      { field: 'key', operator: '==', id: this.state.file },
      { field: 'id_materia', operator: '==', id: this.state.subjectId },
    ]);
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

  probando = (event) => {
    alert('Hola');
    console.log('Hola');
  };

  render() {
    let name = this.props.file.key.split('/');
    name = name.length ? name[name.length - 1] : '';
    const { isLoading, alumno } = this.state;

    return (
      <Fragment>
        {isLoading ? <div id="cover-spin"></div> : <span></span>}
        <div className="item-detail">
          <h2>Detalle de la corrección</h2>
          <dl>
            <dt>Key</dt>
            <dd>{this.props.file.key}</dd>
            <dd>{this.props.fullKey}</dd>
            {('props', console.log(this.props))}
            <dt>Nombre</dt>
            <dd>{alumno}</dd>
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
