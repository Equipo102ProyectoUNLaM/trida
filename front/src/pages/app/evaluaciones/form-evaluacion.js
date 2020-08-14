import React from 'react';
import { Input, ModalFooter, Button, FormGroup, Label, Row } from 'reactstrap';
import { connect } from 'react-redux';
import {
  addDocument,
  editDocument,
  deleteDocument,
  addDocumentWithSubcollection,
  getUsernameById,
} from 'helpers/Firebase-db';
import { Colxx } from 'components/common/CustomBootstrap';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';
import AgregarEjercicio from 'pages/app/evaluaciones/ejercicios/agregar-ejercicio';

class FormEvaluacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      evaluacionId: '',
      nombre: '',
      fecha_creacion: '',
      fecha_finalizacion: '',
      fecha_publicacion: '',
      descripcion: '',
      creador: '',
      modalEditOpen: false,
      modalAddOpen: false,
      ejercicios: [],
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
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

  async componentDidMount() {
    if (this.props.idEval) {
      const userName = await getUsernameById(this.props.user);
      this.setState({
        evaluacionId: this.props.idEval,
        nombre: this.props.evaluacion.nombre,
        fecha_creacion: this.props.evaluacion.fecha_creacion,
        fecha_finalizacion: this.props.evaluacion.fecha_finalizacion,
        fecha_publicacion: this.props.evaluacion.fecha_publicacion,
        descripcion: this.props.evaluacion.descripcion,
        ejercicios: this.props.evaluacion.ejercicios,
        creador: userName,
      });
    }
  }

  onSubmit = async () => {
    let ejercicios = this.ejerciciosComponentRef.getEjerciciosSeleccionados();

    const obj = {
      nombre: this.state.nombre,
      fecha_finalizacion: this.state.fecha_finalizacion,
      fecha_publicacion: this.state.fecha_publicacion,
      descripcion: this.state.descripcion,
      idMateria: this.props.idMateria,
      activo: true,
      subcollection: {
        data: ejercicios,
      },
    };

    await addDocumentWithSubcollection(
      'evaluaciones',
      obj,
      this.props.user,
      'Evaluación',
      'ejercicios',
      'Ejercicios'
    );

    this.props.onEvaluacionAgregada();
  };

  onEdit = async () => {
    let ejercicios = this.ejerciciosComponentRef.getEjerciciosSeleccionados();

    this.state.ejercicios.forEach(async (element) => {
      await deleteDocument(
        `evaluaciones/${this.state.evaluacionId}/ejercicios`,
        element.id
      );
    });

    ejercicios.forEach(async (element) => {
      await addDocument(
        `evaluaciones/${this.state.evaluacionId}/ejercicios`,
        element
      );
    });

    const obj = {
      nombre: this.state.nombre,
      fecha_finalizacion: this.state.fecha_finalizacion,
      fecha_publicacion: this.state.fecha_publicacion,
      descripcion: this.state.descripcion,
    };

    await editDocument(
      'evaluaciones',
      this.state.evaluacionId,
      obj,
      'Evaluación'
    );
    this.toggleEditModal();
    this.props.onEvaluacionEditada();
    return;
  };

  render() {
    const { onCancel, evaluacion } = this.props;
    const {
      modalEditOpen,
      modalAddOpen,
      nombre,
      fecha_finalizacion,
      fecha_publicacion,
      descripcion,
    } = this.state;
    return (
      <form>
        <FormGroup className="mb-3">
          <Label>Nombre de la evaluacion</Label>
          <Input name="nombre" onChange={this.handleChange} value={nombre} />
        </FormGroup>
        {evaluacion.fecha_creacion && (
          <Row>
            <Colxx xxs="6">
              <FormGroup className="mb-3">
                <Label>Fecha de Creación</Label>
                <Input
                  name="fecha_creacion"
                  readOnly
                  value={evaluacion.fecha_creacion}
                />
              </FormGroup>
            </Colxx>
            <Colxx xxs="6">
              <FormGroup className="mb-3">
                <Label>Creada por</Label>
                <Input name="autor" readOnly value={this.state.creador} />
              </FormGroup>
            </Colxx>
          </Row>
        )}

        <Row>
          <Colxx xxs="6">
            <FormGroup className="mb-3">
              <Label>Fecha de Finalización</Label>
              <Input
                name="fecha_finalizacion"
                type="date"
                placeholder="Ingrese la fecha de finalización de la evaluación"
                onChange={this.handleChange}
                value={fecha_finalizacion}
              />
            </FormGroup>
          </Colxx>
          <Colxx xxs="6">
            <FormGroup className="mb-3">
              <Label>Fecha de Publicación</Label>
              <Input
                name="fecha_publicacion"
                type="date"
                placeholder="Ingrese la fecha de publicación de la evaluación"
                onChange={this.handleChange}
                value={fecha_publicacion}
              />
            </FormGroup>
          </Colxx>
        </Row>

        <FormGroup className="mb-3">
          <Label>Descripción</Label>
          <Input
            name="descripcion"
            type="textarea"
            onChange={this.handleChange}
            value={descripcion}
          />
        </FormGroup>

        <AgregarEjercicio
          ref={(ejer) => {
            this.ejerciciosComponentRef = ejer;
          }}
          ejercicios={evaluacion.ejercicios}
        />

        <ModalFooter>
          {!evaluacion.evaluacionId && (
            <>
              <Button color="primary" onClick={this.toggleAddModal}>
                Crear Evaluación
              </Button>
              <Button color="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            </>
          )}
          {evaluacion.evaluacionId && (
            <>
              <Button color="primary" onClick={this.toggleEditModal}>
                Guardar Evaluación
              </Button>
              <Button color="secondary" onClick={onCancel}>
                Cancelar
              </Button>
            </>
          )}
        </ModalFooter>
        {modalEditOpen && (
          <ModalConfirmacion
            texto="¿Está seguro de que desea editar la evaluación?"
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
            texto="¿Está seguro de que desea crear la evaluación?"
            titulo="Crear Evaluación"
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

const mapStateToProps = ({ authUser }) => {
  const { user } = authUser;
  return { user };
};

export default connect(mapStateToProps)(FormEvaluacion);
