import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { firestore } from 'helpers/Firebase';
import { NotificationManager } from 'components/common/react-notifications';

class FormPractica extends React.Component {
  constructor() {
    super();

    this.state = {
      nombre: '',
      descripcion: '',
      fechaLanzada: '',
      duracion: '',
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    firestore
      .collection('practicas')
      .add({
        nombre: this.state.nombre,
        fechaLanzada: this.state.fechaLanzada,
        descripcion: this.state.descripcion,
        duracion: this.state.duracion,
        fechaPublicada: new Date(),
      })
      .then(function () {
        NotificationManager.success(
          'Práctica agregada!',
          'La práctica fue agregada exitosamente',
          3000,
          null,
          null,
          ''
        );
      })
      .catch(function (error) {
        NotificationManager.error(
          'Error al agregar la práctica',
          error,
          3000,
          null,
          null,
          ''
        );
      });

    this.props.onpracticaAgregada();
  };

  render() {
    const { toggleModal } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup className="mb-3">
          <Label>Nombre de la practica</Label>
          <Input
            name="nombre"
            onChange={this.handleChange}
            value={this.state.nombre}
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

        <FormGroup className="mb-3">
          <Label>Fecha Lanzada</Label>
          <Input
            name="fechaLanzada"
            type="date"
            placeholder="DD/MM/AAAA"
            onChange={this.handleChange}
            value={this.state.fechaLanzada}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label check>¿Cual será la duración de la práctica?</Label>
          <Input
            name="duracion"
            onChange={this.handleChange}
            value={this.state.duracion}
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

export default FormPractica;
