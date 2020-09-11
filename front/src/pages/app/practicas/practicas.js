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
import { getFormattedDate } from 'helpers/Utils';
import { storage } from 'helpers/Firebase';

function collect(props) {
  return { data: props.data };
}

class Practica extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      modalCreateOpen: false,
      modalEditOpen: false,
      modalDeleteOpen: false,
      selectedItems: [],
      isLoading: true,
      idItemSelected: null,
      practicaId: '',
      idMateria: this.props.subject.id,
      modalUploadFileOpen: false,
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
        console.log(practica.data);
      }
    }
    this.setState({
      items: arrayDeObjetos,
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

  render() {
    const {
      modalCreateOpen,
      modalEditOpen,
      modalDeleteOpen,
      idItemSelected,
      isLoading,
      items,
      modalUploadFileOpen,
    } = this.state;
    const { rol } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.my-activities"
            toggleModal={rol === ROLES.Docente ? this.toggleCreateModal : null}
            buttonText={rol === ROLES.Docente ? 'activity.add' : null}
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
            {items.map((practica) => {
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
                  onEditItem={
                    rol === ROLES.Docente ? this.toggleEditModal : null
                  }
                  onDelete={rol === ROLES.Docente ? this.onDelete : null}
                  onUploadFile={
                    rol === ROLES.Alumno ? this.toggleUploadFileModal : null
                  }
                  navTo="#"
                  collect={collect}
                  calendario={rol === ROLES.Docente ? true : false}
                />
              );
            })}{' '}
          </Row>
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
