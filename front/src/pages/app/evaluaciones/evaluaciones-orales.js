import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import CardTabsOral from 'components/card-tabs-oral';
import ModalGrande from 'containers/pages/ModalGrande';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import {
  logicDeleteDocument,
  getDocumentWithSubCollection,
  getCollectionWithSubCollections,
} from 'helpers/Firebase-db';
import ROLES from 'constants/roles';
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
      isLoading: true,
      idMateria: this.props.subject.id,
      modalDeleteOpen: false,
      modalEditOpen: false,
      idOral: '',
      idOralEditado: '',
      nombreOralEditado: '',
      fechaOralEditado: '',
      integrantesOral: [],
      oldTestActive: false,
      rolDocente: this.props.rol === ROLES.Docente,
    };
  }

  getEvaluacionesOrales = async (materiaId) => {
    const arrayDeObjetos = await getCollectionWithSubCollections(
      'evaluacionesOrales',
      [
        { field: 'idMateria', operator: '==', id: materiaId },
        { field: 'activo', operator: '==', id: true },
      ],
      false,
      'integrantes'
    );

    const evaluacionesActuales = arrayDeObjetos.filter((elem) => {
      return (
        getTimestampDifference(
          elem.data.base.fecha_evaluacion.toDate(),
          moment().toDate()
        ) >= 0
      );
    });
    this.dataListRenderer(evaluacionesActuales);
  };

  getEvaluacionesOralesVencidas = async (materiaId) => {
    const arrayDeObjetos = await getCollectionWithSubCollections(
      'evaluacionesOrales',
      [
        {
          field: 'fecha_evaluacion',
          operator: '<',
          id: firebase.firestore.Timestamp.now(),
        },
        { field: 'idMateria', operator: '==', id: materiaId },
        { field: 'activo', operator: '==', id: true },
      ],
      false,
      'integrantes'
    );
    this.dataListRenderer(arrayDeObjetos);
  };

  componentDidMount() {
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
      this.getEvaluacionesOralesVencidas(this.state.materiaId);
    } else {
      this.getEvaluacionesOrales(this.state.materiaId);
    }
  };

  onDelete = (idOral) => {
    this.setState({
      idOral,
    });
    this.toggleDeleteModal();
  };

  onEdit = async (idOral) => {
    const oral = await getDocumentWithSubCollection(
      `evaluacionesOrales/${idOral}`,
      'integrantes'
    );
    const { data, subCollection } = oral;
    const { nombre } = data;
    this.setState({
      idOralEditado: idOral,
      nombreOralEditado: nombre,
    });
    this.toggleEditModal();
  };

  borrarOral = async () => {
    await logicDeleteDocument(
      'evaluacionesOral',
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
      nombreOralEditado,
      fechaOralEditado,
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
                    materiaId={this.state.materiaId}
                    isOldTest={this.state.oldTestActive}
                    updateEvaluaciones={this.getEvaluaciones}
                    isSelect={this.state.selectedItems.includes(evaluacion.id)}
                    collect={collect}
                    // navTo={`/app/evaluaciones/detalle-evaluacion/${evaluacion.id}`}
                    onEdit={this.onEdit}
                    onDelete={this.onDelete}
                    onMake={this.onMake}
                    onCancel={this.onCancel}
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
              modalHeader="evaluation.edit"
            ></ModalGrande>
          )}
          {modalDeleteOpen && (
            <ModalConfirmacion
              texto="¿Estás seguro de borrar la evaluación oral?"
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
  const { userData } = authUser;
  const { rol } = userData;

  return { subject, rol };
};

export default injectIntl(connect(mapStateToProps)(EvaluacionesOrales));
