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
    };
  }

  getClases = async (materiaId) => {
    const arrayDeObjetos = await getCollection('clases', [
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

  render() {
    const {
      modalOpen,
      items,
      isLoading,
      modalDeleteOpen,
      modalEditOpen,
      idClaseEditada,
      nombreClaseEditada,
      descClaseEditada,
      fechaClaseEditada,
      salaEditada,
    } = this.state;
    const { rol } = this.props;
    const rolDocente = rol === ROLES.Docente;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading="menu.mis-clases"
            toggleModal={rolDocente ? this.toggleModal : null}
            buttonText={rolDocente ? 'classes.add' : null}
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="classes.add"
          >
            <FormClase
              toggleModal={this.toggleModal}
              onClaseGuardada={this.onClaseGuardada}
            />
          </ModalGrande>
          <Row>
            {items.map((clase) => {
              return (
                <ListaConImagen
                  key={clase.id}
                  item={clase}
                  imagen={imagenClase}
                  isSelect={this.state.selectedItems.includes(clase.id)}
                  collect={collect}
                  navTo={`/app/clases-virtuales/mis-clases/detalle-clase/${clase.id}`}
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
              modalHeader="classes.edit"
            >
              <FormClase
                toggleModal={this.toggleEditModal}
                onClaseGuardada={this.onClaseGuardada}
                idClase={idClaseEditada}
                nombre={nombreClaseEditada}
                fecha={fechaClaseEditada}
                descripcion={descClaseEditada}
                sala={salaEditada}
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
