import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
} from 'reactstrap';
import { Col, Row, Grid } from 'react-flexbox-grid';
import { getUsuariosAlumnosPorMateria } from 'helpers/Firebase-user';
import { getDocument, getCollection } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';

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
    this.getAlumnos();
    this.getDatosPlanilla();
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
    this.setState({
      isLoading: true,
    });
    const planilla = await getDocument(
      `planillasDocente/${this.props.user}/planillas/${this.state.idPlanilla}`
    );
    const columnas = await getCollection(
      `planillasDocente/${this.props.user}/planillas/${this.state.idPlanilla}/columnas`
    );
    this.setState({
      nombrePlanilla: planilla.data.nombre,
      columnas,
      isLoading: false,
    });
  };

  render() {
    const { isLoading, isOpen, toggleModal } = this.props;
    const { nombrePlanilla, alumnos, columnas } = this.state;
    return isLoading || isEmpty(alumnos) || isEmpty(columnas) ? (
      <div className="loading" />
    ) : (
      <Modal isOpen={isOpen} size="lg" toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          Vista Previa: {nombrePlanilla}
        </ModalHeader>
        <ModalBody>
          <Card className="pt-2">
            <Grid className="flex container">
              <Col className="mb-2 pl-3 min-width truncate">
                <span className="header">Alumnos</span>
                {alumnos.map((alumno) => {
                  return (
                    <Row className="col-alumno truncate" key={alumno.id}>
                      {alumno.nombre}
                    </Row>
                  );
                })}
              </Col>
              {columnas.map((columna) => {
                return (
                  <Col className="col-preview" key={columna.id}>
                    <span className="header-max-7 truncate">
                      {columna.data.nombre}
                    </span>
                    {columna.data.valores.map((valor) => {
                      return (
                        <Row
                          className="mb-3 input-20 align-center truncate"
                          key={valor.userId}
                        >
                          {valor.valor}
                        </Row>
                      );
                    })}
                  </Col>
                );
              })}
            </Grid>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="button" onClick={toggleModal}>
            Cerrar
          </Button>
        </ModalFooter>
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
