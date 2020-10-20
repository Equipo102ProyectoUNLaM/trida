import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ListaConImagen from 'components/lista-con-imagen';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import FormClase from './form-clase';
import {
  getCollection,
  logicDeleteDocument,
  getDocument,
} from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import firebase from 'firebase/app';
import { isEmpty, getTimestampDifference } from 'helpers/Utils';
import moment from 'moment';
const publicUrl = process.env.PUBLIC_URL;
const imagenClase = `${publicUrl}/assets/img/imagen-clase-2.png`;

function collect(props) {
  return { data: props.data };
}

class Clase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      modalOpen: false,
      selectedItems: [],
      isLoading: true,
      idMateria: this.props.subject.id,
      modalDeleteOpen: false,
      modalEditOpen: false,
      idClase: '',
      idClaseEditada: '',
      nombreClaseEditada: '',
      descClaseEditada: '',
      fechaClaseEditada: '',
      salaEditada: false,
      oldClassActive: false,
    };
  }

  getClases = async (materiaId) => {
    const arrayDeObjetos = await getCollection('clases', [
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
    ]);

    const clasesActuales = arrayDeObjetos.filter((elem) => {
      return (
        getTimestampDifference(
          elem.data.fecha_clase.toDate(),
          moment().toDate()
        ) >= 0
      );
    });
    this.dataListRenderer(clasesActuales);
  };

  getClasesVencidas = async (materiaId) => {
    const arrayDeObjetos = await getCollection('clases', [
      {
        field: 'fecha_clase',
        operator: '<',
        id: firebase.firestore.Timestamp.now(),
      },
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  componentDidMount() {
    this.getClases(this.state.idMateria);
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onClaseGuardada = () => {
    if (this.state.modalEditOpen) this.toggleEditModal();
    else this.toggleModal();
    this.getClases(this.state.idMateria);
  };

  dataListRenderer(arrayDeObjetos) {
    this.setState({
      items: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
    });
  }

  toggleDeleteModal = () => {
    this.setState({
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  toggleEditModal = () => {
    this.setState({
      modalEditOpen: !this.state.modalEditOpen,
    });
  };

  onDelete = (idClase) => {
    this.setState({
      idClase,
    });
    this.toggleDeleteModal();
  };

  onEdit = async (idClase) => {
    const { data } = await getDocument(`clases/${idClase}`);
    const { nombre, descripcion, fecha, idSala } = data;
    this.setState({
      idClaseEditada: idClase,
      nombreClaseEditada: nombre,
      descClaseEditada: descripcion,
      fechaClaseEditada: fecha,
      salaEditada: idSala ? true : false,
    });
    this.toggleEditModal();
  };

  borrarClase = async () => {
    await logicDeleteDocument('clases', this.state.idClase, 'Clase');
    this.setState({
      idClase: '',
    });
    this.toggleDeleteModal();
    this.getClases(this.state.idMateria);
  };

  toggleOldClassModal = async () => {
    await this.setState({
      oldClassActive: !this.state.oldClassActive,
      isLoading: true,
    });
    if (this.state.oldClassActive) {
      this.getClasesVencidas(this.state.idMateria);
    } else {
      this.getClases(this.state.idMateria);
    }
  };

  render() {
    const {
      modalOpen,
      items,
      isLoading,
      modalDeleteOpen,
      modalEditOpen,
      idClaseEditada,
      oldClassActive,
    } = this.state;
    const { rol } = this.props;
    const rolDocente = rol !== ROLES.Alumno;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading={
              oldClassActive ? 'menu.mis-clases-finalizadas' : 'menu.mis-clases'
            }
            toggleModal={
              rolDocente && !oldClassActive ? this.toggleModal : null
            }
            buttonText={rolDocente && !oldClassActive ? 'classes.add' : null}
            secondaryToggleModal={this.toggleOldClassModal}
            secondaryButtonText={
              oldClassActive ? 'classes.active' : 'classes.old'
            }
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="classes.add"
          >
            <FormClase
              toggleModal={this.toggleModal}
              onClaseGuardada={this.onClaseGuardada}
              textConfirm="Agregar"
              operationType="add"
              idMateria={this.state.idMateria}
            />
          </ModalGrande>
          <Row>
            {!isEmpty(items) &&
              items.map((clase) => {
                return (
                  <ListaConImagen
                    key={clase.id}
                    item={clase}
                    imagen={imagenClase}
                    isSelect={this.state.selectedItems.includes(clase.id)}
                    collect={collect}
                    navTo={`/app/clases-virtuales/mis-clases/detalle-clase/${clase.id}`}
                    onEdit={rolDocente && !oldClassActive ? this.onEdit : null}
                    onDelete={
                      rolDocente && !oldClassActive ? this.onDelete : null
                    }
                    isClase={true}
                  />
                );
              })}
            {isEmpty(items) && (
              <Row className="ml-3">
                <span>No hay clases cargadas</span>
              </Row>
            )}
          </Row>
          {modalEditOpen && (
            <ModalGrande
              modalOpen={modalEditOpen}
              toggleModal={this.toggleEditModal}
              modalHeader="classes.edit"
            >
              <FormClase
                toggleModal={this.toggleEditModal}
                onClaseGuardada={this.onClaseGuardada}
                textConfirm="Editar"
                operationType="edit"
                id={idClaseEditada}
              />
            </ModalGrande>
          )}
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="¿Estás seguro de borrar la clase?"
              titulo="Borrar Clase"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.borrarClase}
            />
          )}
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

export default injectIntl(connect(mapStateToProps)(Clase));
