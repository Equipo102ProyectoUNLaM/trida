import React, { Component, Fragment } from 'react';
import { Colxx } from 'components/common/CustomBootstrap';
import { Row } from 'reactstrap';
import { capitalize } from 'underscore.string';
import HeaderDeModulo from 'components/common/HeaderDeModulo';
import FormEvaluacion from 'pages/app/evaluaciones/form-evaluacion';
import { getDocumentWithSubCollection } from 'helpers/Firebase-db';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

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

    const ejerciciosDesencriptados = this.desencriptarEjercicios(subCollection);

    this.setState({
      evaluacionId: id,
      nombre: CryptoJS.AES.decrypt(nombre, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      fecha_creacion: fecha_creacion,
      fecha_finalizacion: CryptoJS.AES.decrypt(
        fecha_finalizacion,
        secretKey
      ).toString(CryptoJS.enc.Utf8),
      fecha_publicacion: CryptoJS.AES.decrypt(
        fecha_publicacion,
        secretKey
      ).toString(CryptoJS.enc.Utf8),
      descripcion: CryptoJS.AES.decrypt(descripcion, secretKey).toString(
        CryptoJS.enc.Utf8
      ),
      ejercicios: ejerciciosDesencriptados.sort(
        (a, b) => a.data.numero - b.data.numero
      ),
      isLoading: false,
    });
  };

  desencriptarEjercicios = (ejercicios) => {
    let result = ejercicios;
    for (const ejercicio of result) {
      ejercicio.data.tipo = CryptoJS.AES.decrypt(
        ejercicio.data.tipo,
        secretKey
      ).toString(CryptoJS.enc.Utf8);
      ejercicio.data.nombre = CryptoJS.AES.decrypt(
        ejercicio.data.nombre,
        secretKey
      ).toString(CryptoJS.enc.Utf8);
      ejercicio.data.numero = CryptoJS.AES.decrypt(
        ejercicio.data.numero.toString(),
        secretKey
      ).toString(CryptoJS.enc.Utf8);
      if (ejercicio.data.consigna)
        ejercicio.data.consigna = CryptoJS.AES.decrypt(
          ejercicio.data.consigna,
          secretKey
        ).toString(CryptoJS.enc.Utf8);
      if (ejercicio.data.tema)
        ejercicio.data.tema = CryptoJS.AES.decrypt(
          ejercicio.data.tema,
          secretKey
        ).toString(CryptoJS.enc.Utf8);
      if (ejercicio.data.opciones) {
        for (const opcion of ejercicio.data.opciones) {
          opcion.opcion = CryptoJS.AES.decrypt(
            opcion.opcion,
            secretKey
          ).toString(CryptoJS.enc.Utf8);
          opcion.verdadera =
            CryptoJS.AES.decrypt(opcion.verdadera, secretKey).toString(
              CryptoJS.enc.Utf8
            ) === 'true';
        }
      }
    }
    return result;
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
              text={capitalize(nombre)}
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
