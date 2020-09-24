import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import FormPractica from './form-practica';
import FormSubirPractica from './form-subir-practica';
import DataListView from 'containers/pages/DataListView';
import { logicDeleteDocument, getCollection } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import { getFormattedDate, isEmpty } from 'helpers/Utils';
import { storage } from 'helpers/Firebase';

function collect(props) {
  return { data: props.data };
}

class Practica extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      arrayOriginal: [],
      modalCreateOpen: false,
      modalEditOpen: false,
      modalDeleteOpen: false,
      selectedItems: [],
      isLoading: true,
      idItemSelected: null,
      practicaId: '',
      idMateria: this.props.subject.id,
      modalUploadFileOpen: false,
      rolDocente: this.props.rol === ROLES.Docente,
    };
  }

  getPracticas = async (materiaId) => {
    const arrayDeObjetos = await getCollection('practicas', [
      this.props.rol === ROLES.Docente
        ? {
            field: 'fecha_creacion',
            operator: '<=',
            id: new Date().toISOString().slice(0, 10),
          }
        : {
            field: 'fechaLanzada',
            operator: '<=',
            id: new Date().toISOString().slice(0, 10),
          },
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  componentDidMount() {
    this.getPracticas(this.state.idMateria);
  }

  toggleCreateModal = () => {
    this.setState({
      modalCreateOpen: !this.state.modalCreateOpen,
    });
  };

  onPracticaAgregada = () => {
    this.toggleCreateModal();
    this.getPracticas(this.state.idMateria);
  };

  toggleEditModal = (id) => {
    this.setState({
      modalEditOpen: !this.state.modalEditOpen,
      idItemSelected: id,
    });
  };

  onPracticaEditada = () => {
    this.toggleEditModal();
    this.getPracticas(this.state.idMateria);
  };

  toggleDeleteModal = (id) => {
    this.setState({
      modalDeleteOpen: !this.state.modalDeleteOpen,
    });
  };

  onDelete = (idPractica) => {
    this.setState({
      practicaId: idPractica,
    });
    this.toggleDeleteModal();
  };

  toggleUploadFileModal = (id) => {
    this.setState({
      modalUploadFileOpen: !this.state.modalUploadFileOpen,
      idItemSelected: id,
    });
  };

  onFileUploaded = () => {
    this.toggleUploadFileModal();
  };

  deletePractice = async () => {
    await logicDeleteDocument('practicas', this.state.practicaId, 'Práctica');
    this.setState({
      evalId: '',
    });

    this.setState({
      practicaId: '',
    });
    this.onPracticaBorrada();
  };

  onPracticaBorrada = () => {
    this.toggleDeleteModal();
    this.getPracticas(this.state.idMateria);
  };

  async dataListRenderer(arrayDeObjetos) {
    for (const practica of arrayDeObjetos) {
      if (
        practica.data.idArchivo !== undefined &&
        practica.data.idArchivo !== ''
      ) {
        practica.data.url = await this.getFileURL(practica.data.idArchivo);
      }
    }
    this.setState({
      items: arrayDeObjetos,
      arrayOriginal: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
      modalCreateOpen: false,
      modalEditOpen: false,
      practicaId: '',
    });
  }

  getFileURL = async (archivo) => {
    const url = await storage
      .ref('materias/' + this.state.idMateria + '/practicas/')
      .child(archivo)
      .getDownloadURL();
    return url;
  };

  normalizarFecha = (fecha) => {
    const fechaNormal = fecha.split('-');
    return fechaNormal[2] + fechaNormal[1] + fechaNormal[0];
  };

  normalizarNombre = (nombre) => {
    let nombreNormal = nombre.replace(/á/g, 'a');
    nombreNormal = nombreNormal.replace(/é/g, 'e');
    nombreNormal = nombreNormal.replace(/í/g, 'i');
    nombreNormal = nombreNormal.replace(/ó/g, 'o');
    nombreNormal = nombreNormal.replace(/ú/g, 'u');
    return nombreNormal;
  };

  normalizarBusqueda = (search) => {
    const { target } = search;
    const { value } = target;
    let busqueda = value.toLowerCase();
    busqueda = busqueda.replace(/\//g, '');
    busqueda = busqueda.replace(/-/g, '');
    busqueda = this.normalizarNombre(busqueda);
    return busqueda;
  };

  onSearchKey = (search) => {
    const busqueda = this.normalizarBusqueda(search);
    const itemsArray = [...this.state.arrayOriginal];

    const arrayFiltrado = itemsArray.filter((elem) => {
      const fechaLanzada = this.normalizarFecha(elem.data.fechaLanzada);
      const fechaVto = this.normalizarFecha(elem.data.fechaVencimiento);
      const nombre = this.normalizarNombre(elem.data.nombre);

      return (
        nombre.toLowerCase().includes(busqueda) ||
        fechaLanzada.includes(busqueda) ||
        fechaVto.includes(busqueda)
      );
    });
    this.setState({
      items: arrayFiltrado,
    });
  };

  render() {
    const {
      modalCreateOpen,
      modalEditOpen,
      modalDeleteOpen,
      idItemSelected,
      isLoading,
      items,
      modalUploadFileOpen,
      rolDocente,
    } = this.state;
    const { rol } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-activities"
            toggleModal={rolDocente ? this.toggleCreateModal : null}
            buttonText={rolDocente ? 'activity.add' : null}
          />
          <ModalGrande
            modalOpen={modalCreateOpen}
            toggleModal={this.toggleCreateModal}
            modalHeader="activity.add"
          >
            <FormPractica
              toggleModal={this.toggleCreateModal}
              onPracticaOperacion={this.onPracticaAgregada}
              textConfirm="Agregar"
              operationType="add"
              idMateria={this.state.idMateria}
            />
          </ModalGrande>
          <Row>
            <div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
              <input
                type="text"
                name="keyword"
                id="search"
                placeholder="Búsqueda por nombre de práctica, fecha de publicación, fecha de entrega..."
                onChange={(e) => this.onSearchKey(e)}
              />
            </div>
            {!isEmpty(items) &&
              items.map((practica) => {
                return (
                  <DataListView
                    key={practica.id + 'dataList'}
                    id={practica.id}
                    title={practica.data.nombre}
                    text1={
                      'Fecha de publicación: ' +
                      getFormattedDate(practica.data.fechaLanzada)
                    }
                    text2={
                      'Fecha de entrega: ' +
                      getFormattedDate(practica.data.fechaVencimiento)
                    }
                    file={practica.data.url}
                    isSelect={this.state.selectedItems.includes(practica.id)}
                    onEditItem={rolDocente ? this.toggleEditModal : null}
                    onDelete={rolDocente ? this.onDelete : null}
                    onUploadFile={
                      rol === ROLES.Alumno ? this.toggleUploadFileModal : null
                    }
                    navTo="#"
                    collect={collect}
                    calendario={rolDocente ? true : false}
                  />
                );
              })}{' '}
          </Row>
          {isEmpty(items) && (
            <Row className="ml-0">
              <span>No hay resultados</span>
            </Row>
          )}
          {modalEditOpen && (
            <ModalGrande
              modalOpen={modalEditOpen}
              toggleModal={this.toggleEditModal}
              modalHeader="activity.edit"
            >
              <FormPractica
                toggleModal={this.toggleEditModal}
                onPracticaOperacion={this.onPracticaEditada}
                textConfirm="Editar"
                operationType="edit"
                id={idItemSelected}
              />
            </ModalGrande>
          )}
          {modalUploadFileOpen && (
            <ModalGrande
              modalOpen={modalUploadFileOpen}
              toggleModal={this.toggleUploadFileModal}
              modalHeader="activity.upload"
            >
              <FormSubirPractica
                toggleModal={this.toggleUploadFileModal}
                onSubirPracticaOperacion={this.onFileUploaded}
                textConfirm="Subir Práctica"
                id={idItemSelected}
              />
            </ModalGrande>
          )}
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="¿Está seguro de que desea borrar la práctica?"
              titulo="Borrar Práctica"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.deletePractice}
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

export default injectIntl(connect(mapStateToProps)(Practica));
