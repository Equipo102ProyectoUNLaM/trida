import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getDocument } from 'helpers/Firebase-db';
import HeaderDeModulo from 'components/common/HeaderDeModulo';

class RealizarEvaluacionOrañ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evalId: '',
      nombre: '',
      fecha_evaluacion: '',
      idSala: '',
      password: '',
      integrantes: [],
      isLoading: true,
    };
  }

  fetchDetalleDeEvaluacion = async () => {
    const { evalId } = await this.props.match.params;
    const docObj = await getDocument(`evaluacionesOrales/c7I2LSDivP4LAuyFo2Hl`);
    const { data } = docObj;
    const {
      nombre,
      fecha_evaluacion,
      idSala,
      idMateria,
      integrantes,
      password,
    } = data;

    this.setState({
      evalId,
      nombre,
      fecha_evaluacion,
      idSala,
      idMateria,
      integrantes,
      password,
      isLoading: false,
    });
  };

  getDetalleEvaluacionOral = async () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.fetchDetalleDeEvaluacion();
      }
    );
  };

  componentDidMount() {
    this.getDetalleEvaluacionOral();
  }

  goToOrales = () => {
    this.props.history.push(`/app/evaluaciones/orales/`);
  };

  render() {
    const { nombre, idSala, isLoading, idMateria, password } = this.state;

    const { match } = this.props;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <HeaderDeModulo
              text={nombre}
              toggleModal={this.goToOrales}
              buttonText="evaluation-oral.back"
            />
          </Colxx>
        </Row>
        {/* <TabsDeClase
          idMateria={idMateria}
          idSala={idSala}
          password={password}
          idClase={claseId}
          updateContenidos={this.getDetalleEvaluacionOral}
          rol={this.props.rol}
        /> */}
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <CardTitle>Hola</CardTitle>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol } = userData;

  return { rol };
};

export default injectIntl(connect(mapStateToProps)(RealizarEvaluacionOrañ));
