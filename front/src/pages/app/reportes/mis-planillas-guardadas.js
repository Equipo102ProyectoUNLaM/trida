import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import moment from 'moment';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import DataListView from 'containers/pages/DataListView';
import ModalVistaPlanilla from 'containers/pages/ModalVistaPlanilla';

import { createRandomString, getFechaHoraActual, getDate } from 'helpers/Utils';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { enviarNotificacionError } from 'helpers/Utils-ui';
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
    console.log(planillas);
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

  handleDelete = async (idPlanilla) => {
    await deleteDocument(
      `planillasDocente/${this.props.user}/planillas`,
      idPlanilla,
      'Planilla'
    );
    this.getPlanillas();
  };

  handleOpen = () => {
    this.props.history.push({
      pathname: '/app/reportes/mi-planilla',
    });
  };

  render() {
    const { isLoading, planillas, modalPreviewOpen, idPlanilla } = this.state;
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
        <Row>
          {planillas.map((planilla) => {
            return (
              <DataListView
                key={planilla.id}
                id={planilla.id}
                title={planilla.data.nombre}
                text1={`Fecha de Creación: ` + planilla.data.fecha_creacion}
                onDelete={this.handleDelete}
                onOpen={this.handleOpen}
                onPreview={this.togglePreview}
                planilla
                navTo="#"
              />
            );
          })}
        </Row>
        {modalPreviewOpen && (
          <ModalVistaPlanilla
            isOpen={modalPreviewOpen}
            toggleModal={this.togglePreview}
            idPlanilla={idPlanilla}
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
