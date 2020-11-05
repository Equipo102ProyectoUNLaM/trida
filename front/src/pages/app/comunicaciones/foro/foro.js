import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ListaConImagen from 'components/lista-con-imagen';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import FormForo from './form-foro';
import { getUsersOfSubject } from 'helpers/Firebase-user';
import {
  getCollection,
  logicDeleteDocument,
  getDocumentWithSubCollection,
} from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import { isEmpty } from 'helpers/Utils';

function collect(props) {
  return { data: props.data };
}

class Foro extends Component {
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
      idForo: '',
      idForoEditado: '',
      nombreForoEditado: '',
      descForoEditado: '',
      mensajesForo: [],
      privadoEditado: '',
      integrantesEditado: [],
      datosUsuarios: [],
      forosPrivadosActive: false,
    };
  }

  getForos = async (materiaId) => {
    const arrayDeObjetos = await getCollection('foros', [
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
      { field: 'privado', operator: '==', id: false },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  getForosPrivados = async (materiaId) => {
    const arrayDeObjetos = await getCollection('foros', [
      {
        field: 'integrantes',
        operator: 'array-contains',
        id: this.props.user,
      },
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
      { field: 'privado', operator: '==', id: true },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  getTemas = () => {
    if (this.state.forosPrivadosActive) {
      this.getForosPrivados(this.state.idMateria);
    } else {
      this.getForos(this.state.idMateria);
    }
  };

  async componentDidMount() {
    const datos = await getUsersOfSubject(
      this.state.idMateria,
      this.props.user
    );
    this.setState({
      datosUsuarios: datos,
    });

    this.getForos(this.state.idMateria);
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onForoGuardado = () => {
    if (this.state.modalEditOpen) this.toggleEditModal();
    else this.toggleModal();

    this.getTemas();
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

  onDelete = (idForo) => {
    this.setState({
      idForo,
    });
    this.toggleDeleteModal();
  };

  onEdit = async (idForo) => {
    const foro = await getDocumentWithSubCollection(
      `foros/${idForo}`,
      'mensajes'
    );
    const { data, subCollection } = foro;
    const { nombre, descripcion, privado, integrantes, imagen } = data;
    this.setState({
      idForoEditado: idForo,
      nombreForoEditado: nombre,
      descForoEditado: descripcion,
      mensajesForo: subCollection,
      privadoEditado: privado,
      integrantesEditado: integrantes,
      imagenEditada: imagen,
    });
    this.toggleEditModal();
  };

  borrarForo = async () => {
    await logicDeleteDocument('foros', this.state.idForo, 'Foro');
    this.setState({
      idForo: '',
    });
    this.toggleDeleteModal();
    this.getTemas();
  };

  togglePrivateForumsModal = async () => {
    await this.setState({
      forosPrivadosActive: !this.state.forosPrivadosActive,
      isLoading: true,
    });
    this.getTemas();
  };

  render() {
    const {
      modalOpen,
      items,
      isLoading,
      modalDeleteOpen,
      modalEditOpen,
      idForoEditado,
      nombreForoEditado,
      descForoEditado,
      mensajes: mensajesForo,
      forosPrivadosActive,
      datosUsuarios,
      integrantesEditado,
      privadoEditado,
      imagenEditada,
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
              forosPrivadosActive ? 'menu.mis-foros-privados' : 'menu.mis-foros'
            }
            toggleModal={rolDocente ? this.toggleModal : null}
            buttonText={rolDocente ? 'forums.add' : null}
            secondaryToggleModal={this.togglePrivateForumsModal}
            secondaryButtonText={
              forosPrivadosActive ? 'forums.public' : 'forums.privates'
            }
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="forums.add"
          >
            <FormForo
              toggleModal={this.toggleModal}
              onForoGuardado={this.onForoGuardado}
              datosUsuarios={datosUsuarios}
            />
          </ModalGrande>
          <Row>
            {!isEmpty(items) &&
              items.map((foro) => {
                return (
                  <ListaConImagen
                    key={foro.id}
                    item={foro}
                    isSelect={this.state.selectedItems.includes(foro.id)}
                    collect={collect}
                    navTo={`/app/comunicaciones/foro/detalle-foro/${foro.id}`}
                    onEdit={rolDocente ? this.onEdit : null}
                    onDelete={rolDocente ? this.onDelete : null}
                    isClase={false}
                  />
                );
              })}
            {isEmpty(items) && (
              <Row className="ml-3">
                <span>
                  {forosPrivadosActive
                    ? 'No hay temas privados creados'
                    : 'No hay temas públicos creados'}
                </span>
              </Row>
            )}
          </Row>
          {modalEditOpen && (
            <ModalGrande
              modalOpen={modalEditOpen}
              toggleModal={this.toggleEditModal}
              modalHeader="forums.edit"
            >
              <FormForo
                toggleModal={this.toggleEditModal}
                onForoGuardado={this.onForoGuardado}
                idForo={idForoEditado}
                nombre={nombreForoEditado}
                descripcion={descForoEditado}
                mensajes={mensajesForo}
                datosUsuarios={datosUsuarios}
                integrantes={integrantesEditado}
                privado={privadoEditado}
                imagen={imagenEditada}
              />
            </ModalGrande>
          )}
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="¿Estás seguro de borrar el tema del Foro?"
              titulo="Borrar Tema"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.borrarForo}
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

export default injectIntl(connect(mapStateToProps)(Foro));
