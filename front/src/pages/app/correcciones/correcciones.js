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

  render() {
    const { isLoading, items } = this.state;
    const { rol } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-activities"
            toggleModal={null}
            buttonText={null}
          />
          <Row>
            {items.map((correccion) => {
              return (
                <DataListView
                  key={correccion.id + 'dataList'}
                  id={correccion.id}
                  title={correccion.data.nombre}
                  text1={'Mensaje: ' + correccion.data.mensaje}
                  text2={'Alumno: ' + correccion.data.alumno}
                  file={correccion.data.url}
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
