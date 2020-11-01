import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, Button, Card } from 'reactstrap';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import moment from 'moment';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import { createRandomString, getFechaHoraActual, getDate } from 'helpers/Utils';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { enviarNotificacionError } from 'helpers/Utils-ui';

class MisReportesGuardados extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alumnosData: ['test1', 'test2', 'test3'],
      columnas: [],
      inputAgregarColumna: false,
      nombreColumna: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getAlumnos();
  }

  getAlumnos = async () => {
    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { isLoading } = this.state;

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
      </div>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject, course, institution } = seleccionCurso;
  return { subject, course, institution };
};

export default connect(mapStateToProps)(MisReportesGuardados);
