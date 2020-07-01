import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../../components/common/CustomBootstrap';
import TabClassesMenu from '../../../../containers/ui/TabClassesMenu';
import { Row, Col } from 'reactstrap';
import { firestore } from 'helpers/Firebase';

export default class DetalleClase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      claseId: '',
      nombre: '',
      fecha: '',
      descripcion: '',
      idSala: '',
    };
  }

  getDetalleDeClase = async (claseId) => {
    const claseRef = firestore.doc(`clases/${claseId}`);
    try {
      const claseSnapShot = await claseRef.get();
      const { nombre, fecha, descripcion, idSala } = claseSnapShot.data();
      this.setState({
        nombre: nombre,
        fecha: fecha,
        descripcion: descripcion,
        idSala: idSala,
      });
    } catch (err) {
      console.log('Error getting documents', err);
    }
  };

  componentDidMount() {
    const claseId = this.props.location.navProps.itemId;

    this.getDetalleDeClase(claseId);
  }

  render() {
    const { nombre, fecha, descripcion, idSala } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <h1>
              <i className="simple-icon-notebook heading-icon" />{' '}
              <span className="align-middle d-inline-block pt-1">
                {nombre.toUpperCase()}
              </span>
            </h1>
          </Colxx>
        </Row>
        <TabClassesMenu idSala={idSala} />
      </Fragment>
    );
  }
}
