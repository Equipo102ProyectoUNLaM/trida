import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from "rc-switch";
import { createUUID } from "helpers/Utils";
import { firestore } from 'helpers/Firebase';

class FormClase extends React.Component {
  constructor() {
    super();

    this.state = {
      switchVideollamada: false,
      nombre: '',
      fecha: '',
      descripcion: '',
      idSala: ''
    }
  }

  handleChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = () => {
    // acá mandar el state a firestore

    firestore.collection("clases").add({
      descripcion: this.state.descripcion,
      fecha: this.state.fecha,
      nombre: this.state.nombre
    })
    .then(function() {
        console.log("Document successfully written!");
    })
    .catch(function(error) {
        console.error("Error writing document: ", error);
    });
  
  };

  generateIdSala = () => {
    this.setState(prevState => ({
      switchVideollamada: !prevState.switchVideollamada
    }), () => {
      if(this.state.switchVideollamada) {
        const uuid = createUUID();
        console.log(uuid);
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
          <Input name="nombre" onChange={this.handleChange}/>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Fecha</Label>
          <Input name="fecha" type="date" placeholder="DD/MM/AAAA" onChange={this.handleChange}/>
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Descripción</Label>
          <Input name="descripcion" type="textarea" onChange={this.handleChange}/>
        </FormGroup>

        <FormGroup check>
        <Label check>
          ¿Esta clase tendrá videollamada?
        </Label>
        <Switch
          id="Tooltip-Switch"
          className="custom-switch custom-switch-primary custom-switch-small"
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