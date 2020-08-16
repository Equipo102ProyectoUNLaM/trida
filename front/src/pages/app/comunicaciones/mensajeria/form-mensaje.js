import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Row } from 'reactstrap';
import { getCollection, getDocument, addDocument } from 'helpers/Firebase-db';

var datos = [];

class FormMensaje extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textoMensaje: '',
      asunto: '',
      selectedOptions: [],
      selectedTag: [],
      idMateria: this.props.subject.id,
      isLoading: true,
      idUser: this.props.user,
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

  componentWillUnmount() {
    datos = [];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    //Convierto el array de seleccionados al formato { id, nombre }
    const receptores = this.state.selectedOptions.map(
      ({ value, label }) => value
    );

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
    };
    //guardar msj en bd
    await addDocument(
      'mensajes',
      msg,
      this.props.user,
      'Mensaje enviado',
      'Mensaje enviado exitosamente',
      'Error al enviar el mensaje'
    );

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
      let i = 0;

      if (docObj.data.id !== this.state.idUser) {
        const nombre = docObj.data.name;
        // Armo el array que va a alimentar el Select
        datos.push({
          label: nombre,
          value: user,
          key: i,
        });
      }

      i++;
    }

    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { isLoading, selectedOptions, asunto, textoMensaje } = this.state;
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
              placeholder="Seleccione los destinatarios"
              name="form-field-name"
              value={selectedOptions}
              onChange={this.handleChangeMulti}
              options={datos}
              required
            />
          </Colxx>
        </Row>

        <FormGroup className="mb-3 asunto-msj ">
          <Label>Asunto</Label>
          <Input name="asunto" onChange={this.handleChange} value={asunto} />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Mensaje</Label>
          <Input
            name="textoMensaje"
            type="textarea"
            onChange={this.handleChange}
            value={textoMensaje}
          />
        </FormGroup>

        <ModalFooter>
          <Button color="primary" type="submit">
            Enviar
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            Cancelar
          </Button>
        </ModalFooter>
      </form>
    );
  }
}

const mapStateToProps = ({ authUser, seleccionCurso }) => {
  const { user } = authUser;
  const { subject } = seleccionCurso;
  return { user, subject };
};

export default connect(mapStateToProps)(FormMensaje);
