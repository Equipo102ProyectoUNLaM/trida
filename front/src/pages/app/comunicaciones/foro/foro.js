import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import ListaConImagen from 'components/lista-con-imagen';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import FormForo from './form-foro';
import {
  getCollectionWithSubCollections,
  logicDeleteDocument,
  getDocumentWithSubCollection,
} from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
const publicUrl = process.env.PUBLIC_URL;
const imagenForo = `${publicUrl}/assets/img/imagen-clase-2.png`;

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
      fechaForoEditado: '',
      mensajesForo: [],
    };
  }

  getForos = async (materiaId) => {
    const arrayDeObjetos = await getCollectionWithSubCollections(
      'foros',
      [
        { field: 'idMateria', operator: '==', id: materiaId },
        { field: 'activo', operator: '==', id: true },
      ],
      false,
      'mensajes'
    );
    this.dataListRenderer(arrayDeObjetos);
  };

  componentDidMount() {
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
    this.getForos(this.state.idMateria);
  };

  dataListRenderer(arrayDeObjetos) {
    let arrayDeData = [];
    for (let element of arrayDeObjetos) {
      const data = element.data;
      const item = {
        id: element.id,
        data: data.base,
        mensajes: data.subCollections,
      };
      arrayDeData.push(item);
    }
    this.setState({
      items: arrayDeData,
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
    const { nombre, descripcion } = data;
    this.setState({
      idForoEditado: idForo,
      nombreForoEditado: nombre,
      descForoEditado: descripcion,
      mensajesForo: subCollection,
    });
    this.toggleEditModal();
  };

  borrarForo = async () => {
    await logicDeleteDocument('foros', this.state.idForo, 'Foro');
    this.setState({
      idForo: '',
    });
    this.toggleDeleteModal();
    this.getForos(this.state.idMateria);
  };

  render() {
    const {
      modalOpen,
      items,
      isLoading,
      modalDeleteOpen,
      modalEditOpen,
      idForoEditado: idForoEditado,
      nombreForoEditado: nombreForoEditado,
      descForoEditado: descForoEditado,
      fechaForoEditado: fechaForoEditado,
      mensajes: mensajesForo,
    } = this.state;
    const { rol } = this.props;
    const rolDocente = rol === ROLES.Docente;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.mis-foros"
            toggleModal={rolDocente ? this.toggleModal : null}
            buttonText={rolDocente ? 'forums.add' : null}
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="forums.add"
          >
            <FormForo
              toggleModal={this.toggleModal}
              onForoGuardado={this.onForoGuardado}
            />
          </ModalGrande>
          <Row>
            {items.map((foro) => {
              return (
                <ListaConImagen
                  key={foro.id}
                  item={foro}
                  imagen={imagenForo}
                  isSelect={this.state.selectedItems.includes(foro.id)}
                  collect={collect}
                  navTo={`/app/comunicaciones/foro/detalle-foro/${foro.id}`}
                  onEdit={rolDocente ? this.onEdit : null}
                  onDelete={rolDocente ? this.onDelete : null}
                />
              );
            })}{' '}
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
                fecha={fechaForoEditado}
                descripcion={descForoEditado}
                mensajes={mensajesForo}
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
  const { userData } = authUser;
  const { rol } = userData;

  return { subject, rol };
};

export default injectIntl(connect(mapStateToProps)(Foro));
