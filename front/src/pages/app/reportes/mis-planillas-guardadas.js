import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import DataListView from 'containers/pages/DataListView';
import ModalVistaPlanilla from 'containers/pages/ModalVistaPlanilla';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import { isEmpty, getDateTimeStringFromDate } from 'helpers/Utils';
import { getCollection, deleteDocument } from 'helpers/Firebase-db';

class MisReportesGuardados extends Component {
  constructor(props) {
    super(props);

    this.state = {
      planillas: [],
      columnas: [],
      inputAgregarColumna: false,
      nombreColumna: '',
      isLoading: true,
      modalPreviewOpen: false,
      idPlanilla: '',
      modalConfirmacion: false,
      idPlanillaBorrar: '',
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    this.getPlanillas();
  }

  getPlanillas = async () => {
    const planillas = await getCollection(
      `planillasDocente/${this.props.user}/planillas`
    );
    this.setState({
      planillas,
      isLoading: false,
    });
  };

  togglePreview = (idPlanilla) => {
    this.setState({
      modalPreviewOpen: !this.state.modalPreviewOpen,
      idPlanilla,
    });
  };

  toggleModalConfirmacion = (idPlanilla) => {
    this.setState({
      modalConfirmacion: !this.state.modalConfirmacion,
      idPlanillaBorrar: idPlanilla,
    });
  };

  handleDelete = async () => {
    await deleteDocument(
      `planillasDocente/${this.props.user}/planillas`,
      this.state.idPlanillaBorrar,
      'Planilla'
    );
    this.getPlanillas();
    this.toggleModalConfirmacion();
  };

  handleOpen = (idPlanilla) => {
    this.props.history.push({
      pathname: `/app/reportes/mi-planilla-guardada/${idPlanilla}`,
      idPlanilla,
    });
  };

  render() {
    const {
      isLoading,
      planillas,
      modalPreviewOpen,
      idPlanilla,
      modalConfirmacion,
    } = this.state;
    return isLoading ? (
      <div className="cover-spin" />
    ) : (
      <div>
        <HeaderDeModulo
          heading="menu.planillas-guardadas"
          toggleModal={() =>
            this.props.history.push('/app/reportes/mi-planilla')
          }
          buttonText="menu.volver"
        />
        {isEmpty(planillas) && <span>No hay planillas guardadas</span>}
        {!isEmpty(planillas) && (
          <Row>
            {planillas.map((planilla) => {
              return (
                <DataListView
                  key={planilla.id}
                  id={planilla.id}
                  title={planilla.data.nombre}
                  text1={
                    `Fecha de Creación: ` +
                    getDateTimeStringFromDate(planilla.data.fecha_creacion)
                  }
                  onDelete={this.toggleModalConfirmacion}
                  onOpen={this.handleOpen}
                  onPreview={this.togglePreview}
                  planilla
                  navTo="#"
                />
              );
            })}
          </Row>
        )}
        {modalPreviewOpen && (
          <ModalVistaPlanilla
            isOpen={modalPreviewOpen}
            toggleModal={this.togglePreview}
            idPlanilla={idPlanilla}
          />
        )}
        {modalConfirmacion && (
          <ModalConfirmacion
            isOpen={modalConfirmacion}
            toggle={this.toggleModalConfirmacion}
            titulo="Guardar"
            texto="¿Estás seguro de borrar la planilla?"
            buttonSecondary="Cancelar"
            buttonPrimary="Confirmar"
            onConfirm={this.handleDelete}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(MisReportesGuardados);
