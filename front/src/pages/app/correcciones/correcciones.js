import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import ROLES from 'constants/roles';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import DataListView from 'containers/pages/DataListView';
import { getDocument, getCollection } from 'helpers/Firebase-db';
import { storage } from 'helpers/Firebase';

function collect(props) {
  return { data: props.data };
}

class Correcciones extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      selectedItems: [],
      files: [],
      isLoading: true,
      materiaId: this.props.subject.id,
    };
  }

  async componentDidMount() {
    await this.getCorrecciones(this.state.materiaId);
  }

  getCorrecciones = async (materiaId) => {
    const arrayDeObjetos = await getCollection('correcciones', [
      { field: 'idMateria', operator: '==', id: materiaId },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  async dataListRenderer(arrayDeObjetos) {
    for (const correccion of arrayDeObjetos) {
      if (
        correccion.data.idArchivo !== undefined &&
        correccion.data.idArchivo !== ''
      ) {
        correccion.data.url = await this.getFileURL(correccion.data.idArchivo);
        console.log(correccion.data);
      }
    }

    for (let obj of arrayDeObjetos) {
      const alumno = await this.getAlumno(obj.data.idUsuario);
      obj.data.alumno = alumno;
    }

    this.setState({
      items: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
      correccionId: '',
    });
  }

  getFileURL = async (archivo) => {
    const url = await storage
      .ref('materias/' + this.state.materiaId + '/correcciones/')
      .child(archivo)
      .getDownloadURL();
    return url;
  };

  getAlumno = async (id) => {
    const docAlumno = await getDocument(`usuarios/${id}`);
    return docAlumno.data.nombre + ' ' + docAlumno.data.apellido;
  };

  onCorrection = (id) => {
    console.log('ID de correccion:', id);
  };

  render() {
    const { isLoading, items } = this.state;
    const { rol } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-corrections"
            toggleModal={null}
            buttonText={null}
          />
          <Row>
            {rolDocente && (
              <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
                <input
                  type="text"
                  name="keyword"
                  id="search"
                  placeholder="Búsqueda por alumno, estado, nombre de actividad, tipo de actividad..."
                  onChange={(e) => this.onSearchKey(e)}
                />
              </div>
            )}
            {!isEmpty(items) &&
              items.map((correccion) => {
                return (
                  <DataListView
                    key={correccion.id + 'dataList'}
                    id={correccion.id}
                    idArchivo={correccion.data.idArchivo}
                    dataCorreccion={correccion.data}
                    title={correccion.data.nombre}
                    text1={
                      correccion.data.mensaje !== undefined
                        ? 'Mensaje: ' + correccion.data.mensaje
                        : null
                    }
                    text2={
                      rolDocente ? 'Alumno: ' + correccion.data.alumno : ' '
                    }
                    estado={correccion.data.estado}
                    file={correccion.data.url}
                    onCorrection={rolDocente ? this.onCorrection : null}
                    onVerCorrection={this.onVerCorrection}
                    isSelect={this.state.selectedItems.includes(correccion.id)}
                    navTo="#"
                    collect={collect}
                  />
                );
              })}{' '}
          </Row>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject } = seleccionCurso;
  const { userData } = authUser;
  const { rol } = userData;

  return { subject, rol };
};

export default connect(mapStateToProps)(Correcciones);
