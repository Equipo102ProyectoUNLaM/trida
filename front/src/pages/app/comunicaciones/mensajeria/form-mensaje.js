import React, { Component } from 'react';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import { Row } from 'reactstrap';
import { getCollection, getDocument, addDocument } from 'helpers/Firebase-db';
import { getCurrentTime } from 'helpers/Utils';

var datos = [];

class FormMensaje extends Component {
  constructor(props) {
    super(props);

    const { id: idMat } = JSON.parse(localStorage.getItem('subject'));
    const userId = localStorage.getItem('user_id');

    this.state = {
      textoMensaje: '',
      asunto: '',
      selectedOptions: [],
      selectedTag: [],
      idMateria: idMat,
      isLoading: true,
      idUser: userId,
      nombreUser: '',
    };
  }

  componentDidMount() {
    this.getUsersOfSubject(this.state.idMateria);
    this.getUserName();
  }

  getUserName = async () => {
    const docObj = await getDocument(`users/${this.state.idUser}`);
    this.setState({
      nombreUser: docObj.data.name,
    });
  };

  handleChangeMulti = (selectedOptions) => {
    this.setState({ selectedOptions });
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  getFechaHoraActual() {
    const day = new Date().toISOString().slice(0, 10);
    const hour = getCurrentTime();
    return day + ' ' + hour;
  }

  componentWillUnmount() {
    datos = [];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    //Convierto el array de seleccionados al formato { id, nombre }
    const receptores = this.state.selectedOptions.map(({ value, label }) => ({
      id: value,
      nombre: label,
    }));

    const msg = {
      emisor: {
        id: this.state.idUser,
        nombre: this.state.nombreUser,
      },
      receptor: receptores,
      contenido: this.state.textoMensaje,
      asunto: this.state.asunto,
      formal: false,
      general: false,
      idMateria: this.state.idMateria,
      fechaHoraEnvio: this.getFechaHoraActual(),
    };
    //guardar msj en bd
    await addDocument('mensajes', msg, 'Mensaje');

    this.props.onMensajeEnviado();
  };

  getUsersOfSubject = async () => {
    const idMateria = this.state.idMateria;
    const arrayDeObjetos = await getCollection('usuariosPorMateria', [
      { field: 'materia_id', operator: '==', id: idMateria },
    ]);
    // Me quedo con el array de usuarios que pertenecen a esta materia
    const users = arrayDeObjetos[0].data.usuario_id;
    for (const user of users) {
      const docObj = await getDocument(`users/${user}`);
      const i = 0;
      const nombre = docObj.data.name;
      // Armo el array que va a alimentar el Select
      datos.push({
        label: nombre,
        value: user,
        key: i,
      });

      i++;
    }

    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { isLoading } = this.state;
    const { toggleModal } = this.props;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Colxx xxs="12" md="6">
            <label>
              <IntlMessages id="messages.receiver" />
            </label>
            <Select
              className="react-select"
              classNamePrefix="react-select"
              isMulti
              name="form-field-name"
              value={this.state.selectedOptions}
              onChange={this.handleChangeMulti}
              options={datos}
            />
          </Colxx>
        </Row>

        <FormGroup className="mb-3 asunto-msj ">
          <Label>Asunto</Label>
          <Input
            name="asunto"
            onChange={this.handleChange}
            value={this.state.asunto}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Mensaje</Label>
          <Input
            name="textoMensaje"
            type="textarea"
            onChange={this.handleChange}
            value={this.state.textoMensaje}
          />
        </FormGroup>

        <ModalFooter>
          <Button color="primary" type="submit">
            Agregar
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

export default FormMensaje;
