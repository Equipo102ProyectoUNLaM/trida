import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import { capitalize } from 'underscore.string';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';
import { getDocumentWithSubCollection } from 'helpers/Firebase-db';

export default class EditarEvaluacion extends Component {
  constructor(props) {
    super(props);
    const { evaluacionId } = this.props.match.params;

    this.state = {
      evaluacionId,
      nombre: '',
      fecha_creacion: '',
      fecha_publicacion: '',
      fecha_finalizacion: '',
      descripcion: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    const evaluacion = await getDocumentWithSubCollection(
      `evaluaciones/${this.state.evaluacionId}`,
      'ejercicios'
    );

    const { id, data, subCollection } = evaluacion;
    const {
      nombre,
      fecha_creacion,
      fecha_finalizacion,
      fecha_publicacion,
      descripcion,
    } = data;

    this.setState({
      evaluacionId: id,
      nombre: nombre,
      fecha_creacion: fecha_creacion,
      fecha_finalizacion: fecha_finalizacion,
      fecha_publicacion: fecha_publicacion,
      descripcion: descripcion,
      ejercicios: subCollection.sort((a, b) => a.data.numero - b.data.numero),
      isLoading: false,
    });
  };

  onEvaluacionEditada = () => {
    this.props.history.push('/app/evaluaciones');
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
              evaluacion={this.state}
              onCancel={this.onEvaluacionEditada}
              onEvaluacionEditada={this.onEvaluacionEditada}
            />{' '}
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
