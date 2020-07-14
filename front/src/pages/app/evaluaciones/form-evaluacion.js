import React from 'react';
import {
  Input,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  NavLink,
} from 'reactstrap';
import { firestore } from 'helpers/Firebase';
import { NotificationManager } from 'components/common/react-notifications';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';

class FormEvaluacion extends React.Component {
  constructor() {
    super();

    this.state = {
      evaluacionId: '',
      nombre: '',
      fecha: '',
      descripcion: '',
      idMateria: '',
      modalEditOpen: false,
      modalAddOpen: false,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  toggleEditModal = () => {
    this.setState({
      modalEditOpen: !this.state.modalEditOpen,
    });
  };

  toggleAddModal = () => {
    this.setState({
      modalAddOpen: !this.state.modalAddOpen,
    });
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

  onSubmit = () => {
    firestore
      .collection('evaluaciones')
      .add({
        nombre: this.state.nombre,
        fecha: this.state.fecha,
        descripcion: this.state.descripcion,
        idMateria: this.props.idMateria,
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
          'Error al agregar la evaluación',
          error,
          3000,
          null,
          null,
          ''
        );
      });

    this.props.onEvaluacionAgregada();
  };

  onEdit = () => {
    var ref = firestore.collection('evaluaciones').doc(this.state.evaluacionId);
    ref.set(
      {
        nombre: this.state.nombre,
        fecha: this.state.fecha,
        descripcion: this.state.descripcion,
      },
      { merge: true }
    );

    NotificationManager.success(
      'Evaluación editada!',
      'La evaluación fue editada exitosamente',
      3000,
      null,
      null,
      ''
    );
    this.toggleEditModal();
    this.props.onEvaluacionEditada();
    return;
  };

  render() {
    const { onCancel } = this.props;
    const { modalEditOpen, modalAddOpen } = this.state;

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
              <Button color="primary" onClick={this.toggleAddModal}>
                Agregar
              </Button>
              <Button color="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            </>
          )}
          {this.props.idEval && (
            <>
              <Button color="primary" onClick={this.toggleEditModal}>
                Guardar
              </Button>
            </>
          )}
        </ModalFooter>
        {modalEditOpen && (
          <ModalConfirmacion
            texto="Está seguro de que desea guardar la evaluación?"
            titulo="Guardar Evaluación"
            buttonPrimary="Aceptar"
            buttonSecondary="Cancelar"
            toggle={this.toggleEditModal}
            isOpen={modalEditOpen}
            onConfirm={this.onEdit}
          />
        )}
        {modalAddOpen && (
          <ModalConfirmacion
            texto="Está seguro de que desea guardar la evaluación?"
            titulo="Guardar Evaluación"
            buttonPrimary="Aceptar"
            buttonSecondary="Cancelar"
            toggle={this.toggleAddModal}
            isOpen={modalAddOpen}
            onConfirm={this.onSubmit}
          />
        )}
      </form>
    );
  }
}

export default FormEvaluacion;
