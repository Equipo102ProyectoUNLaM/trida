import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, Button, Row } from 'reactstrap';
import { storage } from 'helpers/Firebase';
import '../../../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';
import ROLES from 'constants/roles';
import CorreccionImagen from './correccion-imagen';
import CorreccionTexto from './correccion-texto';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import DataListView from 'containers/pages/DataListView';
import { getDocument, getCollection } from 'helpers/Firebase-db';
import { NavLink } from 'react-router-dom';
import ModalGrande from 'containers/pages/ModalGrande';

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
      subjectId: this.props.subject.id,
      correccionImagen: false,
      correccionTexto: false,
      materiaId: this.props.subject.id,
      idACorregir: '',
      archivoACorregir: '',
      idStorage: '',
      rolDocente: this.props.rol === ROLES.Docente,
      correccionAlumnoUrl: '',
      verCorreccionDocente: false,
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

  onCorrection = (id, idArchivo, file) => {
    const idStorage = idArchivo.split('.')[0];
    this.setState({
      archivoACorregir: file,
      idStorage,
      idACorregir: id,
    });
    return this.props.history.push({
      pathname: '/app/correcciones/correccion',
      subjectId: this.props.subject.id,
      url: file,
      idStorage,
    });
  };

  onCorrectionAlumno = async (idArchivo) => {
    const idStorage = idArchivo.split('.')[0];
    const correccionAlumnoUrl = await this.getFileURL(
      idStorage + '-correccion'
    );
    if (correccionAlumnoUrl) {
      this.setState({ correccionAlumnoUrl });
      return this.toggleCorreccionImagen();
    }
  };

  onVerCorrectionDocente = async (idArchivo) => {
    const idStorage = idArchivo.split('.')[0];
    const correccionAlumnoUrl = await this.getFileURL(
      idStorage + '-correccion'
    );
    if (correccionAlumnoUrl) {
      this.setState({ correccionAlumnoUrl, verCorreccionDocente: true });
      this.toggleCorreccionImagen();
      this.setState({ verCorreccionDocente: false });
    }
  };

  toggleCorreccionImagen = () => {
    this.setState({ correccionImagen: !this.state.correccionImagen });
  };

  toggleCorreccionTexto = () => {
    //this.props.history.push('/correccion-texto');
    this.setState({ correccionTexto: !this.state.correccionTexto });
  };

  render() {
    const {
      isLoading,
      items,
      correccionImagen,
      correccionTexto,
      idACorregir,
      archivoACorregir,
      idStorage,
      rolDocente,
      correccionAlumnoUrl,
      verCorreccionDocente,
    } = this.state;
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
            {items.map((correccion) => {
              return (
                <DataListView
                  key={correccion.id + 'dataList'}
                  id={correccion.id}
                  idArchivo={correccion.data.idArchivo}
                  title={correccion.data.nombre}
                  text1={
                    correccion.data.mensaje !== undefined
                      ? 'Mensaje: ' + correccion.data.mensaje
                      : null
                  }
                  text2={rolDocente ? 'Alumno: ' + correccion.data.alumno : ' '}
                  estado={correccion.data.estado}
                  file={correccion.data.url}
                  onCorrection={rolDocente ? this.onCorrection : null}
                  onCorrectionAlumno={
                    !rolDocente ? this.onCorrectionAlumno : null
                  }
                  onVerCorrectionDocente={
                    rolDocente ? this.onVerCorrectionDocente : null
                  }
                  isSelect={this.state.selectedItems.includes(correccion.id)}
                  navTo="#"
                  collect={collect}
                />
              );
            })}{' '}
          </Row>
        </div>
        <NavLink to="/app/correcciones/correccion"> Text </NavLink>
        {correccionImagen && (
          <Modal
            isOpen={correccionImagen}
            size="xl"
            toggle={this.toggleCorreccionImagen}
            className="modal-correccion"
          >
            <ModalHeader toggle={this.toggleCorreccionImagen}>
              <span>{rolDocente ? 'Corregir' : 'Ver corrección'}</span>
            </ModalHeader>
            <ModalBody className="modal-correccion">
              <CorreccionImagen
                idACorregir={idACorregir}
                archivoACorregir={archivoACorregir}
                idStorage={idStorage}
                correccionAlumnoUrl={correccionAlumnoUrl}
                toggle={this.toggleCorreccionImagen}
                verCorreccionDocente={verCorreccionDocente}
              />
            </ModalBody>
          </Modal>
        )}
        {correccionTexto && (
          <ModalGrande
            modalOpen={correccionTexto}
            toggleModal={this.toggleCorreccionTexto}
            text={rolDocente ? 'Corregir' : 'Ver corrección'}
          >
            <CorreccionTexto
              subjectId={this.props.subject.id}
              url={this.state.archivoACorregir}
              idStorage={this.state.idStorage}
            />
          </ModalGrande>
        )}
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

export default withRouter(connect(mapStateToProps)(Correcciones));
