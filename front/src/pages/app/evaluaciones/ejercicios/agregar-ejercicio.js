import React from 'react';
import { Row, Button, FormGroup, Card, CardBody } from 'reactstrap';
import { Colxx } from 'components/common/CustomBootstrap';
import Select from 'react-select';
import { getCollection } from 'helpers/Firebase-db';
import { TIPO_EJERCICIO } from 'enumerators/tipoEjercicio';
import RespuestaLibre from 'pages/app/evaluaciones/ejercicios/respuesta-libre';
import OpcionMultiple from 'pages/app/evaluaciones/ejercicios/opcion-multiple';
import Oral from 'pages/app/evaluaciones/ejercicios/oral';

class AgregarEjercicio extends React.Component {
  constructor(props) {
    super(props);
    this.getEjercicios();
    this.state = {
      selectData: [],
      ejerciciosSeleccionados: [
        {
          nombre: '',
          tipo: '',
          numero: 1,
        },
      ],
      modalEditOpen: false,
      modalAddOpen: false,
      consigna: '',
      opciones: [],
      tema: '',
      cant: 1,
      submitted: false,
    };
  }

  componentDidMount() {
    if (this.props.ejercicios) {
      let ejercicios = [];
      for (const doc of this.props.ejercicios) {
        ejercicios.push(doc.data);
      }
      this.setState({
        ejerciciosSeleccionados: ejercicios,
        cant: ejercicios.length,
      });
    }
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

  validateEjercicios = () => {
    let valid = true;
    if (this.state.ejerciciosSeleccionados.length === 0) return valid;
    this.setState({ submitted: true });
    for (const ejer of this.state.ejerciciosSeleccionados) {
      if (!ejer.tipo) valid = false;
      else {
        switch (ejer.tipo) {
          case TIPO_EJERCICIO.respuesta_libre:
            if (!ejer.consigna) valid = false;
            break;
          case TIPO_EJERCICIO.oral:
            if (!ejer.tema) valid = false;
            break;
          case TIPO_EJERCICIO.opcion_multiple:
            if (!ejer.opciones || ejer.opciones.length === 0) {
              valid = false;
              break;
            }
            if (!ejer.consigna) valid = false; //Sin consigna
            if (!ejer.opciones.find((x) => x.verdadera === true)) valid = false; //Ninguna verdadera
            if (ejer.opciones.find((x) => !x.opcion)) valid = false; //Alguna sin cargar opcion
            break;
          default:
            break;
        }
      }
    }
    return valid;
  };

  getEjerciciosSeleccionados = () => {
    return this.state.ejerciciosSeleccionados;
  };

  onEjercicioChange = (e, index) => {
    let list = this.state.ejerciciosSeleccionados;
    let ej = list[index];
    list[index] = Object.assign(ej, e);
    this.setState({
      ejerciciosSeleccionados: list,
    });
  };

  getEjercicios = async () => {
    let arrayDeObjetos = await getCollection('ejercicios');
    let datos = [];
    for (const ej of arrayDeObjetos) {
      let i = 0;
      datos.push({
        label: ej.data.nombre,
        value: ej.data.tipo,
        key: i,
      });
      i++;
    }
    this.setState({
      selectData: datos,
    });
  };

  handleAddEjercicio = (e) => {
    let ejer = this.state.ejerciciosSeleccionados;
    let num = this.state.cant + 1;
    ejer.push({ nombre: '', tipo: '', numero: num });
    this.setState({
      ejerciciosSeleccionados: ejer,
      cant: num,
      submitted: false,
    });
  };

  removeExcercise = (index) => {
    let ejercicios = this.state.ejerciciosSeleccionados;
    const numeroEjer = ejercicios[index].numero;
    for (let index = numeroEjer - 1; index < ejercicios.length; index++) {
      ejercicios[index].numero = ejercicios[index].numero - 1;
    }
    ejercicios.splice(index, 1);
    let oldCant = this.state.cant;
    this.setState({
      ejerciciosSeleccionados: ejercicios,
      cant: oldCant - 1,
      submitted: false,
    });
  };

  handleSelectChange = (event, index) => {
    let ejercicios = this.state.ejerciciosSeleccionados;
    ejercicios[index].nombre = event.label;
    ejercicios[index].tipo = event.value;
    this.setState({
      ejerciciosSeleccionados: ejercicios,
    });
  };

  render() {
    const { selectData, ejerciciosSeleccionados, submitted } = this.state;
    return (
      <FormGroup className="mb-3">
        <div className="glyph-icon simple-icon-plus agregar-ejercicios-action-icon">
          <p className="icon-text">Agregar ejercicios</p>
        </div>

        {ejerciciosSeleccionados.map((ejercicio, index) => (
          <Row key={'row ' + index}>
            <Colxx xxs="12">
              <Row>
                <Colxx xxs="12">
                  <Card className="mb-4">
                    <CardBody>
                      <Row>
                        <Colxx className="text-left" xxs="11">
                          <div key={index}>
                            <h6 className="mb-4">
                              Ejercicio N°{ejercicio.numero}
                            </h6>
                            <FormGroup className="mb-3 error-l-275">
                              <Select
                                className="react-select ejerciciosSelect"
                                classNamePrefix="react-select"
                                name="ejercicios-select-1"
                                placeholder="Seleccione el ejercicio que desea crear"
                                value={selectData.find(
                                  (obj) => obj.value === ejercicio.tipo
                                )}
                                onChange={(e) =>
                                  this.handleSelectChange(e, index)
                                }
                                options={selectData}
                              />
                              {submitted && !ejercicio.tipo ? (
                                <div className="invalid-feedback d-block">
                                  Seleccionar tipo de ejercicio
                                </div>
                              ) : null}
                            </FormGroup>

                            {ejercicio.tipo ===
                              TIPO_EJERCICIO.respuesta_libre && (
                              <RespuestaLibre
                                ejercicioId={index}
                                submitted={submitted}
                                preview={false}
                                value={ejercicio}
                                onEjercicioChange={this.onEjercicioChange}
                              />
                            )}

                            {ejercicio.tipo ===
                              TIPO_EJERCICIO.opcion_multiple && (
                              <OpcionMultiple
                                ejercicioId={index}
                                value={ejercicio}
                                submitted={submitted}
                                preview={false}
                                onEjercicioChange={this.onEjercicioChange}
                              />
                            )}

                            {ejercicio.tipo === TIPO_EJERCICIO.oral && (
                              <Oral
                                ejercicioId={index}
                                value={ejercicio}
                                submitted={submitted}
                                preview={false}
                                onEjercicioChange={this.onEjercicioChange}
                              />
                            )}
                          </div>
                        </Colxx>
                        <Colxx xxs="1" className="icon-container">
                          <div
                            className="margin-auto"
                            style={{ textAlign: 'center' }}
                          >
                            <div
                              className="glyph-icon simple-icon-trash delete-icon"
                              onClick={() => this.removeExcercise(index)}
                            />
                            <span className="text-center">
                              Quitar Ejercicio
                            </span>
                          </div>
                        </Colxx>
                      </Row>
                    </CardBody>
                  </Card>
                </Colxx>
              </Row>
            </Colxx>
          </Row>
        ))}
        <Button
          outline
          onClick={this.handleAddEjercicio}
          size="sm"
          color="primary"
          className="button"
        >
          {' '}
          Agregar Ejercicio{' '}
        </Button>
      </FormGroup>
    );
  }
}

export default AgregarEjercicio;
