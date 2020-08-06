import React from 'react';
import {
  Row,
  Input,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  NavLink,
  CustomInput,
} from 'reactstrap';
import Select from 'react-select';
import {
  addDocument,
  editDocument,
  getCollection,
  addDocumentWithSubcollection,
} from 'helpers/Firebase-db';
import ModalConfirmacion from 'containers/pages/ModalConfirmacion';

class FormEvaluacion extends React.Component {
  constructor() {
    super();

    this.getEjercicios();

    this.state = {
      evaluacionId: '',
      nombre: '',
      fecha_finalizacion: '',
      fecha_publicacion: '',
      descripcion: '',
      idMateria: '',
      modalEditOpen: false,
      modalAddOpen: false,
      selectData: [],
      ejerciciosSeleccionados: [
        {
          nombre: '',
          tipo: '',
        },
      ],
      ejercicioSeleccionado: {
        nombre: '',
        tipo: '',
      },
      inputs: ['input-0'],
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
        fecha_finalizacion: this.props.itemsEval.fecha_finalizacion,
        fecha_publicacion: this.props.itemsEval.fecha_publicacion,
        descripcion: this.props.itemsEval.descripcion,
      });
    }
  }

  getEjercicios = async () => {
    let arrayDeObjetos = await getCollection('ejercicios');
    let datos = [];
    for (const ej of arrayDeObjetos) {
      const i = 0;
      datos.push({
        label: ej.data.nombre,
        value: ej.data.tipo,
        key: i,
      });
      i++;
    }
    this.setState({
      selectData: datos,
      ejercicios: arrayDeObjetos,
    });
  };

  handleAddEjercicio = (e) => {
    this.state.ejerciciosSeleccionados.push(this.state.ejercicioSeleccionado);
    this.setState({
      ejercicioSeleccionado: {
        nombre: '',
        tipo: '',
      },
    });
  };

  handleSelectChange = (e) => {
    this.setState({
      ejercicioSeleccionado: {
        nombre: e.label,
        tipo: e.value,
      },
    });
    //this.state.ejercicioSeleccionado.nombre = e.label;
    //this.state.ejercicioSeleccionado.tipo = e.value;
  };

  onSubmit = async () => {
    if (
      this.state.ejerciciosSeleccionados[0].nombre == '' &&
      this.state.ejerciciosSeleccionados[0].tipo == ''
    ) {
      let finalEjerciciosSeleccionados = [
        ...this.state.ejerciciosSeleccionados,
      ];
      finalEjerciciosSeleccionados.splice(0, 1);
      this.setState({ ejerciciosSeleccionados: finalEjerciciosSeleccionados });
    }
    const obj = {
      nombre: this.state.nombre,
      fecha_finalizacion: this.state.fecha_finalizacion,
      fecha_publicacion: this.state.fecha_publicacion,
      descripcion: this.state.descripcion,
      idMateria: this.props.idMateria,
      activo: true,
      subcollection: {
        data: this.state.ejerciciosSeleccionados,
      },
    };
    await addDocumentWithSubcollection(
      'evaluaciones',
      obj,
      'Evaluación',
      'ejercicios',
      'Ejercicios'
    );

    this.props.onEvaluacionAgregada();
  };

  onEdit = async () => {
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
    const { onCancel } = this.props;
    const {
      modalEditOpen,
      modalAddOpen,
      ejercicios,
      ejercicioSeleccionado,
    } = this.state;
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
          <Label>Fecha de Finalización</Label>
          <Input
            name="fecha_finalizacion"
            type="date"
            placeholder="DD/MM/AAAA"
            onChange={this.handleChange}
            value={this.state.fecha_finalizacion}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Fecha de Publicación</Label>
          <Input
            name="fecha_publicación"
            type="date"
            placeholder="DD/MM/AAAA"
            onChange={this.handleChange}
            value={this.state.fecha_publicacion}
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
          <div className="glyph-icon simple-icon-plus agregar-ejercicios-action-icon">
            <p className="icon-text">Agregar ejercicios</p>
          </div>
          {this.state.ejerciciosSeleccionados.map((ejercicio, index) => (
            <Row key={index} className="ejerciciosSelectRow">
              <Select
                className="react-select ejerciciosSelect"
                classNamePrefix="react-select"
                name="ejercicios-select-1"
                value={this.state.selectData.find(
                  (obj) => obj.value === ejercicio
                )}
                onChange={this.handleSelectChange}
                options={this.state.selectData}
              />

              <Button
                outline
                onClick={this.handleAddEjercicio}
                size="sm"
                color="primary"
                className="button"
              >
                {' '}
                Agregar{' '}
              </Button>
            </Row>
          ))}
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
