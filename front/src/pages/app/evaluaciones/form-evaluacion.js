import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { createUUID } from 'helpers/Utils';
import { firestore } from 'helpers/Firebase';
import { NotificationManager } from 'components/common/react-notifications';

class FormEvaluacion extends React.Component {
  constructor() {
    super();

    this.state = {
      nombre: '',
      fecha: '',
      descripcion: '',
      idMateria: '',
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    firestore
      .collection('evaluaciones')
      .add({
        nombre: this.state.nombre,
        fecha: this.state.fecha,
        descripcion: this.state.descripcion,
        idMateria: this.props.materiaId,
      })
      .then(function () {
        NotificationManager.success(
          'Evaluación agregada!',
          'La evaluación fue agregada exitosamente',
          3000,
          null,
          null,
          ''
        );
      })
      .catch(function (error) {
        NotificationManager.error(
          'Error al agregar la clase',
          error,
          3000,
          null,
          null,
          ''
        );
      });

    this.props.onEvaluacionAgregada();
  };

  render() {
    const { toggleModal } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup className="mb-3">
          <Label>Nombre de la evaluacion</Label>
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

export default FormEvaluacion;
