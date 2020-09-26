import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';
import ModalGrande from 'containers/pages/ModalGrande';
import { ModalFooter, Button, FormGroup } from 'reactstrap';
import { storage } from 'helpers/Firebase';
import FileUploader from 'react-firebase-file-uploader';
import { Form } from 'formik';
import { desencriptarEvaluacionImportada } from 'handlers/DecryptionHandler';
import moment from 'moment';

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
    this.props.history.push(`/app/evaluaciones`);
  };

  toggleImportModal = () => {
    this.setState({
      modalImportOpen: !this.state.modalImportOpen,
    });
  };

  handleFileChange = async (e) => {
    const evaluaciones = [];
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e) => {
      this.setState({ isLoading: true });
      const encryptedEval = JSON.parse(e.target.result);
      evaluaciones.push(encryptedEval);
      const evaluacionesDesencriptadas = desencriptarEvaluacionImportada(
        evaluaciones
      );
      console.log('evaluacion', evaluacionesDesencriptadas[0]);
      console.log('evaluacion.id', evaluacionesDesencriptadas[0].id);
      this.toggleImportModal();
      this.setState({
        evaluacionId: evaluacionesDesencriptadas[0].id,
        nombre: evaluacionesDesencriptadas[0].data.nombre,
        fecha_publicacion: evaluacionesDesencriptadas[0].data.fecha_publicacion,
        fecha_finalizacion:
          evaluacionesDesencriptadas[0].data.fecha_finalizacion,
        descripcion: evaluacionesDesencriptadas[0].data.descripcion,
        ejercicios: evaluacionesDesencriptadas[0].subCollection.sort(
          (a, b) => a.data.numero - b.data.numero
        ),
        evaluacionImportada: true,
        isLoading: false,
      });
    };
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
              <label className="practicas-adjuntar-button">
                <input type="file" onChange={this.handleFileChange} />
              </label>
              {this.state.file && (
                <div>
                  <div className="practica-file-element">
                    <p>1 Archivo seleccionado</p>
                  </div>
                </div>
              )}
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
