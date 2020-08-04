import React from 'react';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { createUUID } from 'helpers/Utils';
import { addDocument } from 'helpers/Firebase-db';
import * as CryptoJS from 'crypto-js';
import { secretKey } from 'constants/defaultValues';

class FormClase extends React.Component {
  constructor() {
    super();

    this.state = {
      switchVideollamada: false,
      nombre: '',
      fecha: '',
      descripcion: '',
      idSala: '',
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { id } = JSON.parse(localStorage.getItem('subject'));

    const obj = {
      nombre: this.state.nombre,
      fecha: this.state.fecha,
      descripcion: this.state.descripcion,
      idSala: this.state.idSala,
      idMateria: id,
      contenidos: [],
    };
    await addDocument(
      'clases',
      obj,
      this.props.user,
      'Clase agregada',
      'Clase agregada exitosamente',
      'Error al agregar la clase'
    );

    this.props.onClaseAgregada();
  };

  generateIdSala = () => {
    this.setState(
      (prevState) => ({
        switchVideollamada: !prevState.switchVideollamada,
      }),
      () => {
        if (this.state.switchVideollamada) {
          const uuid = createUUID();
          const encriptada = CryptoJS.AES.encrypt(uuid, secretKey).toString();
          this.setState({ idSala: encriptada });
        }
      }
    );
  };

  render() {
    const { toggleModal } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup className="mb-3">
          <Label>Nombre de la clase</Label>
          <Input
            name="nombre"
            onChange={this.handleChange}
            value={this.state.nombre}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Fecha</Label>
          <Input
            name="fecha"
            type="date"
            placeholder="DD/MM/AAAA"
            onChange={this.handleChange}
            value={this.state.fecha}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Descripción</Label>
          <Input
            name="descripcion"
            type="textarea"
            onChange={this.handleChange}
            value={this.state.descripcion}
          />
        </FormGroup>

        <FormGroup check>
          <Label check>¿Esta clase tendrá videollamada?</Label>
          <Switch
            id="Tooltip-Switch"
            className="custom-switch custom-switch-primary"
            onChange={this.generateIdSala}
            checkedChildren="Si"
            unCheckedChildren="No"
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

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(FormClase);
