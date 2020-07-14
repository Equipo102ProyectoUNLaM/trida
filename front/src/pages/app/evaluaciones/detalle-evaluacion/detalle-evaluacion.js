import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import { capitalize } from 'underscore.string';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';
import { getDocument } from 'helpers/Firebase-db';

export default class DetalleEvaluacion extends Component {
  constructor(props) {
    super(props);
    const { evaluacionId } = this.props.match.params;

    this.state = {
      evaluacionId,
      nombre: '',
      fecha: '',
      descripcion: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    const docObj = await getDocument(`evaluaciones/${this.state.evaluacionId}`);
    const { id, data } = docObj;
    const { nombre, fecha, descripcion } = data;
    this.setState({
      evaluacionId: id,
      nombre,
      fecha,
      descripcion,
      isLoading: false,
    });
  };

  onEvaluacionEditada = () => {
    this.getDoc();
  };

  render() {
    const { nombre, isLoading } = this.state;
    const { match } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <HeaderDeModulo
              text={capitalize(nombre)}
              match={match}
              breadcrumb
            />
            <FormEvaluacion
              idEval={this.state.evaluacionId}
              itemsEval={this.state}
              onEvaluacionEditada={this.onEvaluacionEditada}
            />{' '}
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
