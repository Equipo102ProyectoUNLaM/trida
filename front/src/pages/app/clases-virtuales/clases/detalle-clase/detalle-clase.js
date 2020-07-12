import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../../../components/common/CustomBootstrap';
import TabsDeClase from './tabs-de-clase';
import { Row, Col } from 'reactstrap';
import { firestore } from 'helpers/Firebase';
import { capitalize } from 'underscore.string';
import HeaderDeModulo from 'components/common/HeaderDeModulo';

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
          </Colxx>
        </Row>
        <TabsDeClase idSala={idSala} />
      </Fragment>
    );
  }
}
