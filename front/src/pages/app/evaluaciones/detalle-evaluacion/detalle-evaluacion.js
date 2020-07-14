import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import { firestore } from 'helpers/Firebase';
import { capitalize } from 'underscore.string';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';

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
    var docRef = firestore
      .collection('evaluaciones')
      .doc(this.state.evaluacionId);
    try {
      var doc = await docRef.get();
      const docId = doc.id;
      const { nombre, fecha, descripcion } = doc.data();
      this.setState({
        evaluacionId: docId,
        nombre,
        fecha,
        descripcion,
      });
    } catch (err) {
      console.log('Error getting documents', err);
    } finally {
      this.setState({ isLoading: false });
    }
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
              itemsEval={this.state}
              onEvaluacionEditada={this.onEvaluacionEditada}
            />{' '}
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
