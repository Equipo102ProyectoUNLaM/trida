import React, { Component, Fragment } from 'react';
import { Colxx } from '../../../../../components/common/CustomBootstrap';
import TabsDeClase from './tabs-de-clase';
import { Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getDocument } from 'helpers/Firebase-db';
import HeaderDeModulo from 'components/common/HeaderDeModulo';

class DetalleClase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      claseId: '',
      nombre: '',
      fecha: '',
      descripcion: '',
      idSala: '',
      password: '',
      isLoading: true,
    };
  }

  fetchDetalleDeClase = async () => {
    const { claseId } = this.props.match.params;

    const docObj = await getDocument(`clases/${claseId}`);
    const { data } = docObj;
    const {
      nombre,
      fecha,
      descripcion,
      idSala,
      idMateria,
      contenidos,
      password,
    } = data;

    this.setState({
      claseId,
      nombre,
      fecha,
      descripcion,
      idSala,
      idMateria,
      contenidos,
      password,
      isLoading: false,
    });
  };

  getDetalleDeClase = async () => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        this.fetchDetalleDeClase();
      }
    );
  };

  componentDidMount() {
    this.getDetalleDeClase();
  }

  render() {
    const {
      nombre,
      idSala,
      isLoading,
      idMateria,
      contenidos,
      claseId,
      password,
    } = this.state;

    const { match } = this.props;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <HeaderDeModulo text={nombre} match={match} breadcrumb />
          </Colxx>
        </Row>
        <TabsDeClase
          contenidos={contenidos}
          idMateria={idMateria}
          idSala={idSala}
          password={password}
          idClase={claseId}
          updateContenidos={this.getDetalleDeClase}
          rol={this.props.rol}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { userData } = authUser;
  const { rol } = userData;

  return { rol };
};

export default injectIntl(connect(mapStateToProps)(DetalleClase));
