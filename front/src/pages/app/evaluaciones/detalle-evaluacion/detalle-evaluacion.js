import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row, Col } from 'reactstrap';
import { firestore } from 'helpers/Firebase';
import { capitalize } from 'underscore.string';
import HeaderDeModulo from 'components/common/HeaderDeModulo';

export default class DetalleEvaluacion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evalId: '',
      nombre: '',
      fecha: '',
      descripcion: '',
      idSala: '',
      isLoading: true,
    };
  }

  getDetalleDeEvaluacion = async () => {
    const { evalId } = this.props.match.params;
    this.setState({ evalId });
    /* 
    const claseRef = firestore.doc(`clases/${claseId}`);
    try {
      const claseSnapShot = await claseRef.get();
      const { nombre, fecha, descripcion, idSala } = claseSnapShot.data();
      this.setState({
        claseId,
        nombre,
        fecha,
        descripcion,
        idSala,
        isLoading: false,
      });
    } catch (err) {
      console.log('Error getting documents', err);
    } */
  };

  componentDidMount() {
    this.getDetalleDeEvaluacion();
  }

  render() {
    console.log('here');
    const { nombre, isLoading } = this.state;
    const { match } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <HeaderDeModulo
              heading={capitalize(nombre)}
              match={match}
              breadcrumb
            />
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
