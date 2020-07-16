import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../../../components/common/CustomBootstrap';
import TabsDeClase from './tabs-de-clase';
import { Row } from 'reactstrap';
import { capitalize } from 'underscore.string';
import { getDocument } from 'helpers/Firebase-db';
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

    const docObj = await getDocument(`clases/${claseId}`);
    const { data } = docObj;
    const { nombre, fecha, descripcion, idSala } = data;
    this.setState({
      claseId,
      nombre,
      fecha,
      descripcion,
      idSala,
      isLoading: false,
    });
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
