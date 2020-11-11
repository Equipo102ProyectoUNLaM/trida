import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import IconCard from 'containers/pages/IconCards';
import { Colxx } from 'components/common/CustomBootstrap';
import { getDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';
import { rolesData } from 'constants/rolesData';
import { getUserData } from 'helpers/Firebase-user';
const publicUrl = process.env.PUBLIC_URL;
const imagenDefaultUsuario = `${publicUrl}/assets/img/defaultUser.png`;

class PaginaAlumnos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      usuariosArray: [],
    };
  }
  componentDidMount() {
    this.getAlumnos();
  }

  getAlumnos = async () => {
    const { data } = await getDocument(
      `usuariosPorMateria/${this.props.subject.id}`
    );

    const usuariosArrayPromise = data.usuario_id.map(async (elem) => {
      const user = await getUserData(elem);
      console.log(user);
      return {
        id: elem,
        nombre: user.nombre + ' ' + user.apellido,
        mail: user.mail,
        rol: user.rol,
        foto: user.foto || imagenDefaultUsuario,
      };
    });
    const usuariosArrayRaw = await Promise.all(usuariosArrayPromise);
    const usuariosArray = usuariosArrayRaw.sort((a, b) => b.rol - a.rol);
    this.setState({
      usuariosArray,
      isLoading: false,
    });
  };

  render() {
    const { isLoading, usuariosArray } = this.state;
    return (
      <>
        <HeaderDeModulo
          heading="menu.alumnos-materia"
          toggleModal={() => this.props.history.push('/app/admin')}
          buttonText="menu.volver"
        />
        {isLoading && <div className="loading" />}
        {!isLoading && isEmpty(usuariosArray) ? (
          <p className="mb-4">No hay usuarios asociados a la materia</p>
        ) : (
          <Row className="icon-cards-row mb-2">
            {usuariosArray.map((item) => {
              return (
                <Colxx
                  xxs="6"
                  sm="4"
                  md="3"
                  lg="2"
                  key={`icon_card_${item.id}`}
                >
                  <IconCard
                    foto={item.foto}
                    title={item.nombre ? item.nombre : item.mail}
                    value1={item.mail}
                    value2={rolesData(item.rol).rolTexto}
                    className="mb-4"
                    to="#"
                  />
                </Colxx>
              );
            })}
          </Row>
        )}
      </>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return {
    subject,
  };
};

export default connect(mapStateToProps)(PaginaAlumnos);
