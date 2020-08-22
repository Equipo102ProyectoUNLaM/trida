import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';

class AgregarEvaluacion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      evaluacionId: '',
      nombre: '',
      fecha_creacion: '',
      fecha_publicacion: '',
      fecha_finalizacion: '',
      descripcion: '',
      isLoading: true,
      idMateria: this.props.subject.id,
      ejercicios: [],
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  onEvaluacionAgregada = () => {
    this.props.history.push(`/app/evaluaciones`);
  };

  render() {
    const { isLoading } = this.state;
    const { match } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <HeaderDeModulo
              text="Agregar Evaluación"
              match={match}
              breadcrumb
            />
            <FormEvaluacion
              evaluacion={this.state}
              onEvaluacionAgregada={this.onEvaluacionAgregada}
              onCancel={this.onEvaluacionAgregada}
              idMateria={this.state.idMateria}
            />{' '}
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(AgregarEvaluacion);
