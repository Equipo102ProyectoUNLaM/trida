import React from 'react';
import { connect } from 'react-redux';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import { getDocument, addDocument, editDocument } from 'helpers/Firebase-db';

class FormPractica extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      descripcion: '',
      fechaLanzada: '',
      duracion: '',
      fechaVencimiento: '',
      idMateria: '',
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    if (this.props.id) {
      const { data } = await getDocument(`practicas/${this.props.id}`);
      const {
        nombre,
        descripcion,
        fechaLanzada,
        duracion,
        fechaVencimiento,
      } = data;
      this.setState({
        nombre,
        descripcion,
        fechaLanzada,
        duracion,
        fechaVencimiento,
      });
    }
    return;
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    if (this.props.operationType === 'add') {
      const obj = {
        nombre: this.state.nombre,
        fechaLanzada: this.state.fechaLanzada,
        descripcion: this.state.descripcion,
        duracion: this.state.duracion,
        fechaVencimiento: this.state.fechaVencimiento,
        fechaPublicada: new Date(),
        activo: true,
        idMateria: this.props.subject.id,
      };
      await addDocument(
        'practicas',
        obj,
        this.props.user,
        'Práctica agregada',
        'Práctica agregada exitosamente',
        'Error al agregar la práctica'
      );
    } else {
      const obj = {
        nombre: this.state.nombre,
        fechaLanzada: this.state.fechaLanzada,
        descripcion: this.state.descripcion,
        duracion: this.state.duracion,
        fechaVencimiento: this.state.fechaVencimiento,
      };
      await editDocument('practicas', this.props.id, obj, 'Práctica');
    }

    this.props.onPracticaOperacion();
  };

  render() {
    const { toggleModal, textConfirm } = this.props;

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
          <Label>Fecha Vencimiento</Label>
          <Input
            name="fechaVencimiento"
            type="date"
            placeholder="DD/MM/AAAA"
            onChange={this.handleChange}
            value={this.state.fechaVencimiento}
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
            {textConfirm}
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

export default connect(mapStateToProps)(FormPractica);
