import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import { getDocument, getCollection } from 'helpers/Firebase-db';

class ModalVistaPlanilla extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      idPlanilla: this.props.idPlanilla,
      nombrePlanilla: '',
      columnas: [],
      alumnos: [],
    };
  }

  componentDidMount() {
    this.getDatosPlanilla();
    this.getAlumnos();
  }

  getAlumnos = async () => {
    const alumnos = await getUsuariosAlumnosPorMateria(this.props.subject.id);
    console.log(alumnos);
    this.setState({
      alumnos,
      isLoading: false,
    });
  };

  getDatosPlanilla = async () => {
    const planilla = await getDocument(
      `planillasDocente/${this.props.user}/planillas/${this.state.idPlanilla}`
    );
    const columnas = await getCollection(
      `planillasDocente/${this.props.user}/planillas/${this.state.idPlanilla}/columnas`
    );
    this.setState({ nombrePlanilla: planilla.data.nombre, columnas });
  };

  render() {
    const {
      isLoading,
      isOpen,
      toggleModal,
      nombrePlanilla,
      alumnos,
    } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Modal isOpen={isOpen} size="lg" toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Vista Previa: {nombrePlanilla}
        </ModalHeader>
        <ModalBody>
          <Grid>
            <Col>
              Alumnos
              {alumnos.map((alumno) => {
                return <Row key={alumno.id}>{alumno.nombre}</Row>;
              })}
            </Col>
          </Grid>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = ({ seleccionCurso, authUser }) => {
  const { subject } = seleccionCurso;
  const { user } = authUser;
  return { subject, user };
};

export default connect(mapStateToProps)(ModalVistaPlanilla);
