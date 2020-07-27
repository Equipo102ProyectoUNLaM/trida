import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../../components/common/CustomBootstrap';
import TabsDeMensajeria from './tabs-de-mensajeria';
import { Row } from 'reactstrap';
import { capitalize } from 'underscore.string';
import { getCollection } from 'helpers/Firebase-db';
import HeaderDeModulo from 'components/common/HeaderDeModulo';

export default class Mensajeria extends Component {
  constructor(props) {
    super(props);

    const { id } = JSON.parse(localStorage.getItem('subject'));

    this.state = {
      items: [],
      modalMessageOpen: false,
      materiaId: id,
      usuarioId: JSON.parse(localStorage.getItem('user_id')),
      isLoading: true,
    };
  }

  getMensajes = async () => {
    const arrayDeObjetos = await getCollection('mensajes', [
      {
        field: 'receptor',
        operator: 'array-contains',
        id: this.state.usuarioId,
      },
      { field: 'idMateria', operator: '==', id: materiaId },
      { field: 'general', operator: '==', id: false },
      { field: 'formal', operator: '==', id: false },
    ]);
    this.dataListRenderer(arrayDeObjetos);
  };

  componentDidMount() {
    this.getMensajes();
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
              heading="menu.messages"
              toggleModal={this.onAdd}
              buttonText="mensajes.enviar"
            />
          </Colxx>
        </Row>
        <TabsDeMensajeria itemsSent={itemsSent} itemsReceive={itemsReceive} />
      </Fragment>
    );
  }
}
