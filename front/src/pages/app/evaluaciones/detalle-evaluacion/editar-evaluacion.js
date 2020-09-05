import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import { capitalizeString } from 'helpers/Utils';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';
import { getDocumentWithSubCollection } from 'helpers/Firebase-db';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';
import { desencriptarEjercicios } from 'handlers/DecryptionHandler';

export default class EditarEvaluacion extends Component {
  constructor(props) {
    super(props);
    const { evaluacionId } = this.props.match.params;

    this.state = {
      evaluacionId,
      nombre: '',
      fecha_creacion: '',
      fecha_publicacion: '',
      fecha_finalizacion: '',
      descripcion: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    const evaluacion = await getDocumentWithSubCollection(
      `evaluaciones/${this.state.evaluacionId}`,
      'ejercicios'
    );

    const { id, data, subCollection } = evaluacion;
    const {
      nombre,
      fecha_creacion,
      fecha_finalizacion,
      fecha_publicacion,
      descripcion,
    } = data;

    const ejerciciosDesencriptados = desencriptarEjercicios(subCollection);

    this.setState({
      evaluacionId: id,
      nombre: CryptoJS.AES.decrypt(nombre, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      fecha_creacion: fecha_creacion,
      fecha_finalizacion: fecha_finalizacion,
      fecha_publicacion: fecha_publicacion,
      descripcion: CryptoJS.AES.decrypt(descripcion, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      ejercicios: ejerciciosDesencriptados.sort(
        (a, b) => a.data.numero - b.data.numero
      ),
      isLoading: false,
    });
  };

  onEvaluacionEditada = () => {
    this.props.history.push('/app/evaluaciones');
  };

  render() {
    const { nombre, isLoading } = this.state;
    const { match } = this.props;
    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <HeaderDeModulo
              text={capitalizeString(nombre)}
              match={match}
              breadcrumb
            />
            <FormEvaluacion
              idEval={this.state.evaluacionId}
              evaluacion={this.state}
              onCancel={this.onEvaluacionEditada}
              onEvaluacionEditada={this.onEvaluacionEditada}
            />{' '}
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
