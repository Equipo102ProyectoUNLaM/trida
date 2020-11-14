import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row, InputGroup, CustomInput } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';
import ModalGrande from 'containers/pages/ModalGrande';
import { FormGroup } from 'reactstrap';
import { desencriptarEvaluacionImportada } from 'helpers/DecryptionHandler';
import { enviarNotificacionError } from 'helpers/Utils-ui';

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
      modalImportOpen: false,
      evaluacionImportada: false,
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  onEvaluacionAgregada = () => {
    this.props.history.push(`/app/evaluaciones/escritas`);
  };

  toggleImportModal = () => {
    this.setState({
      modalImportOpen: !this.state.modalImportOpen,
    });
  };

  handleFileChange = async (e) => {
    const evaluaciones = [];
    const fileReader = new FileReader();
    const fileExtension = e.target.files[0].name.split('.')[1];
    if (fileExtension === 'trida') {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        this.setState({ isLoading: true });
        const encryptedEval = JSON.parse(e.target.result);
        evaluaciones.push(encryptedEval);
        const evaluacionesDesencriptadas = desencriptarEvaluacionImportada(
          evaluaciones
        );
        this.toggleImportModal();
        this.setState({
          evaluacionId: evaluacionesDesencriptadas[0].id,
          nombre: evaluacionesDesencriptadas[0].data.nombre,
          fecha_publicacion:
            evaluacionesDesencriptadas[0].data.fecha_publicacion,
          fecha_finalizacion:
            evaluacionesDesencriptadas[0].data.fecha_finalizacion,
          descripcion: evaluacionesDesencriptadas[0].data.descripcion,
          sin_salir_de_ventana:
            evaluacionesDesencriptadas[0].data.sin_salir_de_ventana,
          sin_capturas: evaluacionesDesencriptadas[0].data.sin_capturas,
          ejercicios: evaluacionesDesencriptadas[0].subCollection.sort(
            (a, b) => a.data.numero - b.data.numero
          ),
          evaluacionImportada: true,
          isLoading: false,
        });
      };
    } else {
      enviarNotificacionError(
        'Se debe cargar una evaluación con extensión .trida',
        'El archivo no es válido'
      );
      e.target.value = null;
    }
  };

  render() {
    const { isLoading, modalImportOpen } = this.state;
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
              toggleModal={this.toggleImportModal}
              buttonText="evaluation.import"
            />
            <FormEvaluacion
              idEval={this.state.evaluacionId}
              evaluacion={this.state}
              onEvaluacionAgregada={this.onEvaluacionAgregada}
              onCancel={this.onEvaluacionAgregada}
              idMateria={this.state.idMateria}
              evaluacionImportada={this.state.evaluacionImportada}
            />{' '}
          </Colxx>
        </Row>
        {modalImportOpen && (
          <ModalGrande
            modalOpen={modalImportOpen}
            toggleModal={this.toggleImportModal}
            modalHeader="evaluation.import"
          >
            <FormGroup>
              <InputGroup className="mb-3">
                <CustomInput
                  type="file"
                  label="Seleccioná un archivo con extensión .trida"
                  onInputCapture={this.handleFileChange}
                />
              </InputGroup>
            </FormGroup>
          </ModalGrande>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ seleccionCurso }) => {
  const { subject } = seleccionCurso;
  return { subject };
};

export default connect(mapStateToProps)(AgregarEvaluacion);
