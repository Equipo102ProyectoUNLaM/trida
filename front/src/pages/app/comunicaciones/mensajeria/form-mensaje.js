import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import { Colxx } from 'components/common/CustomBootstrap';
import IntlMessages from 'helpers/IntlMessages';
import { Row } from 'reactstrap';
import { getCollection, getDocument, addDocument } from 'helpers/Firebase-db';
import ROLES from 'constants/roles';

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
      esGeneral: false,
    };
  }

  componentDidMount() {
    this.getUsersOfSubject(this.state.idMateria);
  }

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

    //Si no es un mensaje general, convierto el array de seleccionados al formato { id, nombre }
    let receptores = null;
    if (!this.state.esGeneral) {
      receptores = this.state.selectedOptions.map(({ value, label }) => value);
    }

    const msg = {
      emisor: {
        id: this.state.idUser,
        nombre: this.props.nombre + this.props.apellido,
      },
      receptor: receptores,
      contenido: this.state.textoMensaje,
      asunto: this.state.asunto,
      formal: false,
      general: this.state.esGeneral,
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

  handleCheckBoxChange = async () => {
    this.setState({
      esGeneral: !this.state.esGeneral,
      selectedOptions: [],
    });
  };

  getUsersOfSubject = async () => {
    const idMateria = this.state.idMateria;
    const arrayDeObjetos = await getCollection('usuariosPorMateria', [
      { field: 'materia_id', operator: '==', id: idMateria },
    ]);
    // Me quedo con el array de usuarios que pertenecen a esta materia
    const users = arrayDeObjetos[0].data.usuario_id;
    for (const user of users) {
      const docObj = await getDocument(`usuarios/${user}`);
      let i = 0;

      if (docObj.data.id !== this.state.idUser) {
        const nombre = docObj.data.nombre + ' ' + docObj.data.apellido;
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
    const {
      isLoading,
      selectedOptions,
      asunto,
      textoMensaje,
      esGeneral,
    } = this.state;
    const { toggleModal, rol } = this.props;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <form onSubmit={this.handleSubmit}>
        <Row>
          <Colxx xxs="12" md="12">
            <label>
              <IntlMessages id="messages.receiver" />
            </label>
            <Row>
              <Colxx xxs="12" md="4">
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
                  isDisabled={esGeneral}
                />
              </Colxx>
              {rol === ROLES.Docente && (
                <Colxx xxs="12" md="6" className="receivers-general">
                  <Input
                    name="esGeneral"
                    className="general-check"
                    type="checkbox"
                    checked={esGeneral}
                    onChange={() => this.handleCheckBoxChange()}
                  />
                  <label>¿Es un mensaje general?</label>
                </Colxx>
              )}
            </Row>
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
  const { user, userData } = authUser;
  const { nombre, apellido, rol } = userData;
  const { subject } = seleccionCurso;
  return { user, subject, nombre, apellido, rol };
};

export default connect(mapStateToProps)(FormMensaje);
