import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Button, Badge } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { Colxx } from 'components/common/CustomBootstrap';
import { injectIntl } from 'react-intl';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import Calendario from 'components/common/Calendario';
import FormPractica from './form-practica';
import FormSubirPractica from './form-subir-practica';
import DataListView from 'containers/pages/DataListView';
import { logicDeleteDocument, getCollection } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import { getFormattedDate, isEmpty } from 'helpers/Utils';
import { storage } from 'helpers/Firebase';
import { isMobile } from 'react-device-detect';
import * as _moment from 'moment';
import HeaderDeModuloMobile from 'components/common/HeaderDeModuloMobile';
const moment = _moment;

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
      oldPracticesActive: false,
      rolDocente: this.props.rol !== ROLES.Alumno,
      fechaPublicacion: '',
    };
  }

  getPracticas = async (materiaId) => {
    let filtros = [
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
    ];

    if (!this.state.rolDocente) {
      filtros.push({
        field: 'fechaLanzada',
        operator: '<=',
        id: new Date().toISOString().slice(0, 10),
      });
    }

    const arrayDeObjetos = await getCollection('practicas', filtros, false);

    let practicasActuales = arrayDeObjetos.filter((elem) => {
      return moment(elem.data.fechaVencimiento).isAfter(moment(new Date()));
    });

    this.dataListRenderer(practicasActuales);
  };

  getPracticasVencidas = async (materiaId) => {
    const arrayDeObjetos = await getCollection('practicas', [
      {
        field: 'fechaVencimiento',
        operator: '<',
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

  toggleOldPracticesModal = async () => {
    await this.setState({
      oldPracticesActive: !this.state.oldPracticesActive,
      isLoading: true,
    });
    if (this.state.oldPracticesActive) {
      this.getPracticasVencidas(this.state.idMateria);
    } else {
      this.getPracticas(this.state.idMateria);
    }
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
    for (let practica of arrayDeObjetos) {
      if (
        practica.data.idArchivo !== undefined &&
        practica.data.idArchivo !== ''
      ) {
        practica.data.url = await this.getFileURL(practica.data.idArchivo);
      }

      const result = await getCollection('correcciones', [
        { field: 'idPractica', operator: '==', id: practica.id },
        { field: 'idUsuario', operator: '==', id: this.props.user },
      ]);

      practica.entregada = result.length > 0;
    }

    this.setState({
      items: arrayDeObjetos,
      arrayOriginal: arrayDeObjetos,
      selectedItems: [],
      isLoading: false,
      modalCreateOpen: false,
      modalEditOpen: false,
      practicaId: '',
      filtroFecha: '',
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

  handleClickCalendario = (date) => {
    if (date) {
      this.setState({ filtroFecha: moment(date).format('DD/MM/YYYY') });
      return this.onSearchKey({
        target: { value: moment(date).format('DDMMYYYY') },
      });
    }
    return this.setState({
      filtroFecha: '',
      items: [...this.state.arrayOriginal],
    });
  };

  handleFiltroDelete = () => {
    this.setState({
      filtroFecha: '',
      items: [...this.state.arrayOriginal],
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
      oldPracticesActive,
      rolDocente,
      filtroFecha,
    } = this.state;
    const { rol } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          {isMobile ? (
            <HeaderDeModuloMobile
              heading={
                oldPracticesActive
                  ? 'menu.my-old-activities'
                  : 'menu.my-activities'
              }
              toggleIcon={
                rolDocente && !oldPracticesActive
                  ? this.toggleCreateModal
                  : null
              }
              iconText={
                rolDocente && !oldPracticesActive
                  ? 'glyph-icon iconsminds-add'
                  : null
              }
              secondaryToggle={this.toggleOldPracticesModal}
              secondaryButtonText={
                oldPracticesActive ? 'activity.active' : 'activity.old'
              }
            />
          ) : (
            <HeaderDeModulo
              heading={
                oldPracticesActive
                  ? 'menu.my-old-activities'
                  : 'menu.my-activities'
              }
              toggleModal={
                rolDocente && !oldPracticesActive
                  ? this.toggleCreateModal
                  : null
              }
              buttonText={
                rolDocente && !oldPracticesActive ? 'activity.add' : null
              }
              secondaryToggleModal={this.toggleOldPracticesModal}
              secondaryButtonText={
                oldPracticesActive ? 'activity.active' : 'activity.old'
              }
            />
          )}
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
            <Colxx xxs="12" xs="12" md="6" lg="8" className="w-xs-100">
              <div className="search-sm float-md-left mr-1 mb-1 align-top">
                <input
                  type="text"
                  name="keyword"
                  id="search"
                  placeholder="Búsqueda por nombre de práctica, fecha de publicación, fecha de entrega..."
                  onChange={(e) => this.onSearchKey(e)}
                  autoComplete="off"
                />
              </div>
            </Colxx>
            <Colxx
              xxs="12"
              xs="12"
              md="6"
              lg="4"
              className="columna-filtro-badge"
            >
              <Badge pill className="mb-1 position-absolute badge badge-filtro">
                <Calendario
                  handleClick={this.handleClickCalendario}
                  text="Filtro por fecha de entrega o publicación"
                  evalCalendar={false}
                  filterCalendar={true}
                  id="fechasFilter"
                />
                Filtro por Fechas
                {filtroFecha && (
                  <>
                    {' '}
                    - {filtroFecha}
                    <Button
                      className="delete-filter "
                      onClick={this.handleFiltroDelete}
                      close
                    />
                  </>
                )}
              </Badge>
            </Colxx>
          </Row>
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
                  onEditItem={
                    rolDocente && !oldPracticesActive
                      ? this.toggleEditModal
                      : null
                  }
                  onDelete={
                    rolDocente && !oldPracticesActive ? this.onDelete : null
                  }
                  onUploadFile={
                    rol === ROLES.Alumno && !oldPracticesActive
                      ? this.toggleUploadFileModal
                      : null
                  }
                  navTo="#"
                  collect={collect}
                  calendario={rolDocente && !oldPracticesActive ? true : false}
                  entregada={practica.entregada ? true : false}
                  noEntregada={
                    !practica.entregada && oldPracticesActive ? true : false
                  }
                />
              );
            })}{' '}
          {isEmpty(items) && (
            <Row className="ml-0">
              <span>No hay prácticas</span>
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
              texto="¿Estás seguro de borrar la práctica?"
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
  const { userData, user } = authUser;
  const { rol } = userData;

  return { subject, rol, user };
};

export default injectIntl(connect(mapStateToProps)(Practica));
