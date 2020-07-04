import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../../../components/common/CustomBootstrap';
import TabsDeClase from './tabs-de-clase';
import { Row, Col } from 'reactstrap';
import { firestore } from 'helpers/Firebase';
import { capitalize } from 'underscore.string';

export default class DetalleClase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      claseId: '',
      nombre: '',
      fecha: '',
      descripcion: '',
      idSala: '',
      isLoading: true,
    };
  }

  getDetalleDeClase = async () => {
    const { claseId } = this.props.match.params;

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
    }
  };

  componentDidMount() {
    this.getDetalleDeClase();
  }

  render() {
    const { nombre, idSala, isLoading } = this.state;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1>
              <i className="simple-icon-notebook heading-icon" />{' '}
              <span className="align-middle d-inline-block pt-1">
                {capitalize(nombre)}
              </span>
            </h1>
          </Colxx>
        </Row>
        <TabsDeClase idSala={idSala} />
      </Fragment>
    );
  }
}
