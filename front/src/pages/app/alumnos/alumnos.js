import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import IconCard from 'containers/pages/IconCards';
import { Colxx } from 'components/common/CustomBootstrap';
import { getDocument } from 'helpers/Firebase-db';
import { isEmpty } from 'helpers/Utils';

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
      const { data } = await getDocument(`usuarios/${elem}`);
      return {
        id: elem,
        nombre: data.nombre + ' ' + data.apellido,
        rol: data.rol,
      };
    });
    const usuariosArray = await Promise.all(usuariosArrayPromise);
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
          toggleModal={() => this.props.history.push('/app/home')}
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
                    icon={
                      item.rol === 1
                        ? 'iconsminds-male-female'
                        : 'iconsminds-student-male-female'
                    }
                    title={item.nombre}
                    value={item.rol === 1 ? 'Docente' : 'Alumno'}
                    className="mb-4"
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
