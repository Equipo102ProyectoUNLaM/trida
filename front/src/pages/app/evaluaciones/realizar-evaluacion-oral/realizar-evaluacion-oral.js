import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getDocument } from 'helpers/Firebase-db';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import PaginaVideollamada from './pagina-videollamada';

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
    const { evalId } = this.props.location;
    const docObj = await getDocument(`evaluacionesOrales/${evalId}`);
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
    const { nombre, idSala, isLoading, password, evalId } = this.state;

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
        <Row className="mb-4">
          <Colxx xxs="12">
            <Card>
              <CardBody>
                <PaginaVideollamada
                  idSala={idSala}
                  evalId={evalId}
                  password={password}
                />
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
