import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { createUUID } from 'helpers/Utils';
import { addDocument } from 'helpers/Firebase-db';

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
    };
    await addDocument('clases', obj, 'Clase');

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
          this.setState({ idSala: uuid });
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

export default FormClase;
