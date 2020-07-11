import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label } from 'reactstrap';
import Switch from 'rc-switch';
import { firestore } from 'helpers/Firebase';
import { NotificationManager } from 'components/common/react-notifications';

class FormPractica extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nombre: '',
      descripcion: '',
      fechaLanzada: '',
      duracion: '',
      fechaVencimiento: '',
    };
  }

  componentDidMount() {
    this.getDoc();
  }

  getDoc = async () => {
    const obj = {};
    if (this.props.id) {
      var docRef = firestore.collection('practicas').doc(this.props.id);
      try {
        var doc = await docRef.get();
        const docId = doc.id;
        const {
          nombre,
          fechaLanzada,
          descripcion,
          fechaVencimiento,
          duracion,
        } = doc.data();
        obj = {
          id: docId,
          nombre: nombre,
          descripcion: descripcion,
          fechaLanzada: fechaLanzada,
          fechaVencimiento: fechaVencimiento,
          duracion: duracion,
        };
      } catch (err) {
        console.log('Error getting documents', err);
      } finally {
        return this.dataRenderer(obj);
      }
    }
    return;
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  dataRenderer = (obj) => {
    const {
      nombre,
      descripcion,
      fechaLanzada,
      duracion,
      fechaVencimiento,
    } = obj;
    this.setState({
      nombre,
      descripcion,
      fechaLanzada,
      duracion,
      fechaVencimiento,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.operationType === 'add') {
      firestore
        .collection('practicas')
        .add({
          nombre: this.state.nombre,
          fechaLanzada: this.state.fechaLanzada,
          descripcion: this.state.descripcion,
          duracion: this.state.duracion,
          fechaVencimiento: this.state.fechaVencimiento,
          fechaPublicada: new Date(),
          idMateria: JSON.parse(localStorage.getItem('subject')),
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
    }

    this.props.onPracticaOperation();
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

export default FormPractica;
