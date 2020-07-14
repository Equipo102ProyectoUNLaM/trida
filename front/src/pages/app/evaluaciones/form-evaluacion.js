import React from 'react';
import {
  Input,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  NavLink,
} from 'reactstrap';
import { addDocument, editDocument } from 'helpers/Firebase-db';

class FormEvaluacion extends React.Component {
  constructor() {
    super();

    this.state = {
      evaluacionId: '',
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

  componentDidMount() {
    if (this.props.idEval) {
      this.setState({
        evaluacionId: this.props.idEval,
        nombre: this.props.itemsEval.nombre,
        fecha: this.props.itemsEval.fecha,
        descripcion: this.props.itemsEval.descripcion,
      });
    }
  }

  onSubmit = async () => {
    const obj = {
      nombre: this.state.nombre,
      fecha: this.state.fecha,
      descripcion: this.state.descripcion,
      idMateria: this.props.materiaId,
    };
    await addDocument('evaluaciones', obj, 'Evaluación');

    this.props.onEvaluacionAgregada();
  };

  onEdit = async () => {
    const obj = {
      nombre: this.state.nombre,
      fecha: this.state.fecha,
      descripcion: this.state.descripcion,
    };
    await editDocument(
      'evaluaciones',
      this.state.evaluacionId,
      obj,
      'Evaluación'
    );
    this.props.onEvaluacionEditada();
    return;
  };

  render() {
    const { toggleModal } = this.props;
    return (
      <form>
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
        <FormGroup className="mb-3">
          {!this.props.idEval && (
            <NavLink
              className="form-nav-link" //onClick={} -> guardar y navegar a pantalla de detalle de clase, para agregar ejercicios
            >
              <div className="glyph-icon simple-icon-plus agregar-ejercicios-action-icon">
                <p className="icon-text">Agregar ejercicios</p>
              </div>
            </NavLink>
          )}
          {this.props.idEval && (
            <p>Acá se van a mostrar ejercicios asociados a esa eval</p>
          )}
        </FormGroup>
        <ModalFooter>
          {!this.props.idEval && (
            <>
              <Button color="primary" onClick={this.onSubmit}>
                Agregar
              </Button>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
            </>
          )}
          {this.props.idEval && (
            <>
              <Button color="primary" onClick={this.onEdit}>
                Editar
              </Button>
            </>
          )}
        </ModalFooter>
      </form>
    );
  }
}

export default FormEvaluacion;
