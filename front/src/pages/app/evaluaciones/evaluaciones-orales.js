import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import CardTabsOral from 'components/card-tabs-oral';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import { logicDeleteDocument, getCollection } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
import { getUsersOfSubject } from 'helpers/Firebase-user';
import { isEmpty, getTimestampDifference } from 'helpers/Utils';
import FormEvaluacionOral from './form-evaluacion-oral';
import firebase from 'firebase/app';
import * as _moment from 'moment';
const moment = _moment;

function collect(props) {
  return { data: props.data };
}

class EvaluacionesOrales extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      modalOpen: false,
      selectedItems: [],
      datosUsuarios: [],
      isLoading: true,
      idMateria: this.props.subject.id,
      modalDeleteOpen: false,
      modalEditOpen: false,
      idOral: '',
      idOralEditado: '',
      nombreOralEditada: '',
      fechaOralEditada: '',
      integrantesEditados: [],
      oldTestActive: false,
      rolDocente: this.props.rol !== ROLES.Alumno,
    };
  }

  getEvaluacionesOrales = async (materiaId) => {
    let filtros = [
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
    ];
    if (this.state.rolDocente) {
      filtros.push({
        field: 'integrantes',
        operator: 'array-contains',
        id: this.props.user,
      });
    }

    const arrayDeObjetos = await getCollection(
      'evaluacionesOrales',
      filtros,
      false
    );

    const evaluacionesActuales = arrayDeObjetos.filter((elem) => {
      return (
        getTimestampDifference(
          elem.data.fecha_evaluacion.toDate(),
          moment().toDate()
        ) > 0
      );
    });
    this.dataListRenderer(evaluacionesActuales);
  };

  getEvaluacionesOralesVencidas = async (materiaId) => {
    let filtros = [
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'activo', operator: '==', id: true },
      {
        field: 'fecha_evaluacion',
        operator: '<',
        id: firebase.firestore.Timestamp.now(),
      },
    ];
    if (this.state.rolDocente) {
      filtros.push({
        field: 'integrantes',
        operator: 'array-contains',
        id: this.props.user,
      });
    }

    const arrayDeObjetos = await getCollection(
      'evaluacionesOrales',
      filtros,
      false
    );
    this.dataListRenderer(arrayDeObjetos);
  };

  async componentDidMount() {
    const datos = await getUsersOfSubject(
      this.state.idMateria,
      this.props.user
    );
    this.setState({
      datosUsuarios: datos,
    });

    this.getEvaluacionesOrales(this.state.idMateria);
  }

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen,
    });
  };

  onOralGuardado = () => {
    if (this.state.modalEditOpen) this.toggleEditModal();
    else this.toggleModal();
    this.getEvaluacionesOrales(this.state.idMateria);
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

  toggleOldPracticesModal = async () => {
    await this.setState({
      oldTestActive: !this.state.oldTestActive,
      isLoading: true,
    });
    if (this.state.oldTestActive) {
      this.getEvaluacionesOralesVencidas(this.state.idMateria);
    } else {
      this.getEvaluacionesOrales(this.state.idMateria);
    }
  };

  onDelete = (idOral) => {
    this.setState({
      idOral,
    });
    this.toggleDeleteModal();
  };

  onEdit = async (oral) => {
    const { data } = oral;
    const { nombre, fecha_evaluacion, integrantes } = data;
    this.setState({
      idOralEditado: oral.id,
      nombreOralEditada: nombre,
      fechaOralEditada: fecha_evaluacion,
      integrantesEditados: integrantes,
    });
    this.toggleEditModal();
  };

  onMake = async (evaluacion) => {
    this.props.history.push({
      pathname: '/app/evaluaciones/orales/realizar-evaluacion-oral',
      evalId: evaluacion.id,
    });
  };

  borrarOral = async () => {
    await logicDeleteDocument(
      'evaluacionesOrales',
      this.state.idOral,
      'Evaluación'
    );
    this.setState({
      idOral: '',
    });
    this.toggleDeleteModal();
    this.getEvaluacionesOrales(this.state.idMateria);
  };

  render() {
    const {
      modalOpen,
      items,
      isLoading,
      modalDeleteOpen,
      modalEditOpen,
      idOralEditado,
      nombreOralEditada,
      fechaOralEditada,
      integrantesEditados,
      datosUsuarios,
      oldTestActive,
      rolDocente,
    } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <div className="disable-text-selection">
          <HeaderDeModulo
            heading={
              oldTestActive
                ? 'menu.my-old-oral-evaluations'
                : 'menu.my-oral-evaluations'
            }
            toggleModal={rolDocente && !oldTestActive ? this.toggleModal : null}
            buttonText={
              rolDocente && !oldTestActive ? 'evaluation.add-oral' : null
            }
            secondaryToggleModal={this.toggleOldPracticesModal}
            secondaryButtonText={
              oldTestActive ? 'evaluation.active-oral' : 'evaluation.old-oral'
            }
          />
          <ModalGrande
            modalOpen={modalOpen}
            toggleModal={this.toggleModal}
            modalHeader="evaluation.add-oral"
          >
            <FormEvaluacionOral
              toggleModal={this.toggleModal}
              onOralGuardado={this.onOralGuardado}
              textConfirm="Agregar"
              operationType="add"
              idMateria={this.state.materiaId}
              datosUsuarios={datosUsuarios}
            />
          </ModalGrande>
          <Row>
            {!isEmpty(items) &&
              items.map((evaluacion) => {
                return (
                  <CardTabsOral
                    key={evaluacion.id}
                    id={evaluacion.id}
                    item={evaluacion}
                    materiaId={this.state.idMateria}
                    isOldTest={this.state.oldTestActive}
                    updateEvaluaciones={this.getEvaluacionesOrales}
                    isSelect={this.state.selectedItems.includes(evaluacion.id)}
                    collect={collect}
                    onEdit={this.onEdit}
                    onDelete={this.onDelete}
                    onMake={this.onMake}
                  />
                );
              })}
            {isEmpty(items) && (
              <Row className="ml-3">
                <span>No hay evaluaciones orales creadas</span>
              </Row>
            )}
          </Row>
          {modalEditOpen && (
            <ModalGrande
              modalOpen={modalEditOpen}
              toggleModal={this.toggleEditModal}
              modalHeader="evaluation-oral.edit"
            >
              <FormEvaluacionOral
                toggleModal={this.toggleEditModal}
                onOralGuardado={this.onOralGuardado}
                textConfirm="Editar"
                operationType="edit"
                idMateria={this.state.materiaId}
                datosUsuarios={datosUsuarios}
                nombreOralEditada={nombreOralEditada}
                fechaOralEditada={fechaOralEditada}
                idOralEditado={idOralEditado}
                integrantesEditados={integrantesEditados}
              />
            </ModalGrande>
          )}
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="¿Estás seguro de borrar la evaluación?"
              titulo="Borrar Evaluación"
              buttonPrimary="Aceptar"
              buttonSecondary="Cancelar"
              toggle={this.toggleDeleteModal}
              isOpen={modalDeleteOpen}
              onConfirm={this.borrarOral}
            />
          )}
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject } = seleccionCurso;
  const { user, userData } = authUser;
  const { rol } = userData;

  return { subject, rol, user };
};

export default injectIntl(connect(mapStateToProps)(EvaluacionesOrales));
