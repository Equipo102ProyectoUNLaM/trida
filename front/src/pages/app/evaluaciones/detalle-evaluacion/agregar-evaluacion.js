import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';

export default class AgregarEvaluacion extends Component {
  constructor(props) {
    super(props);

    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      evaluacionId: '',
      nombre: '',
      fecha: '',
      descripcion: '',
      isLoading: true,
      idMateria: id,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  onEvaluacionAgregada = () => {
    this.props.history.push(`/app/evaluations`);
  };

  render() {
    const { isLoading } = this.state;
    const { match } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <HeaderDeModulo
              text="Agregar Evaluación"
              match={match}
              breadcrumb
            />
            <FormEvaluacion
              idEval={this.state.evaluacionId}
              itemsEval={this.state}
              onEvaluacionAgregada={this.onEvaluacionAgregada}
              idMateria={this.state.idMateria}
            />{' '}
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
