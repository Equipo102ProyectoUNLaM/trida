import React, { Fragment } from 'react';
import { Row, Input, Button, Label, FormGroup } from 'reactstrap';

class PreguntasAleatorias extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cantidad: null,
      respuestas: [],
      preguntas: [
        {
          opcion: '',
        },
      ],
    };
  }

  componentDidMount() {
    if (this.props.value.opciones) {
      this.setState({
        consigna: this.props.value.consigna,
        opciones: this.props.value.opciones,
      });
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: value });
    this.props.onEjercicioChange({ [name]: value }, this.props.ejercicioId);
  };

  handleOptionsChange = (event, index) => {
    const { value, name } = event.target;
    let list = this.state.preguntas;
    list[index] = Object.assign(list[index], { [name]: value });
    this.setState({ preguntas: list });
    this.props.onEjercicioChange({ preguntas: list }, this.props.ejercicioId);
  };

  handleCheckBoxChange = (event, index) => {
    const { name, checked } = event.target;
    let list = this.state.opciones;
    list[index] = Object.assign(list[index], { [name]: checked });
    this.setState({ opciones: list });
    this.props.onEjercicioChange({ opciones: list }, this.props.ejercicioId);
  };

  handleResponseCheckBoxChange = (event, index) => {
    const { checked } = event.target;
    let rtas = this.state.respuestas;
    rtas.push({ indiceOpcion: index, respuesta: checked });
    this.setState({
      respuestas: rtas,
    });
    this.props.onEjercicioChange(
      { indiceOpcion: index, respuesta: checked },
      this.props.value.numero
    );
  };

  handleAddOpcion = (e) => {
    let newPreguntas = this.state.preguntas;
    let opcion = {
      opcion: '',
    };
    newPreguntas.push(opcion);
    this.setState({
      preguntas: newPreguntas,
    });
  };

  removeOption = (index) => {
    let newPreguntas = this.state.preguntas;
    newPreguntas.splice(index, 1);
    this.setState({
      preguntas: newPreguntas,
    });
  };

  render() {
    let { opciones, consigna, cantidad, respuestas, preguntas } = this.state;

    const { preview, resolve } = this.props;

    return (
      <Fragment>
        {preview && (
          <div>
            <div className="mb-2">
              <Label>{consigna}</Label>
            </div>
            {opciones.map((op, index) => (
              <Row key={'row' + index} className="opcionMultipleRow">
                <Input
                  name="respuesta"
                  className="margin-auto checkbox"
                  type="checkbox"
                />
                <Label className="opcionMultipleInput margin-auto">
                  {op.opcion}
                </Label>
              </Row>
            ))}{' '}
          </div>
        )}

        {resolve && (
          <div>
            <div className="mb-2">
              <Label>{consigna}</Label>
            </div>
            {opciones.map((op, index) => (
              <Row key={'row' + index} className="opcionMultipleRow">
                <Input
                  name="verdadera"
                  className="margin-auto checkbox"
                  type="checkbox"
                  onChange={(e) => this.handleResponseCheckBoxChange(e, index)}
                />
                <Label className="opcionMultipleInput margin-auto">
                  {op.opcion}
                </Label>
              </Row>
            ))}{' '}
            {this.props.submitted &&
            !respuestas.find((x) => x.respuesta === true) ? (
              <div className="invalid-feedback d-block">
                Al menos una opción seleccionada es requerida
              </div>
            ) : null}
          </div>
        )}

        {!preview && !resolve && (
          <div>
            <div>
              <FormGroup className="error-l-75">
                <Label>
                  Cantidad de preguntas a seleccionar aleatoriamente
                </Label>
                <Input
                  name="cantidad"
                  type="number"
                  onInputCapture={this.handleChange}
                  defaultValue={cantidad}
                />
                {this.props.submitted && !consigna ? (
                  <div className="invalid-feedback d-block">
                    Ingresar una pregunta
                  </div>
                ) : null}
              </FormGroup>
            </div>
            <div>
              <FormGroup className="error-l-275">
                <Label>Preguntas</Label>
                {this.props.submitted &&
                (!opciones || opciones.length === 0) ? (
                  <div className="invalid-feedback d-block">
                    Opciones requeridas
                  </div>
                ) : null}
                {preguntas.map((op, index) => (
                  <Row key={'row' + index} className="opcionMultipleRow">
                    <Input
                      className="opcionMultipleInput margin-auto"
                      name="opcion"
                      onInputCapture={(e) => this.handleOptionsChange(e, index)}
                      defaultValue={op.opcion}
                    />
                    <div
                      className="glyph-icon simple-icon-close remove-icon"
                      onClick={() => this.removeOption(index)}
                    />
                    {this.props.submitted &&
                    !opciones.find((x) => x.verdadera === true) ? (
                      <div
                        className="invalid-feedback d-block"
                        style={{ left: '525px' }}
                      >
                        Una respuesta verdadera es requerida
                      </div>
                    ) : null}
                    {this.props.submitted && opciones.find((x) => !x.opcion) ? (
                      <div className="invalid-feedback d-block">
                        Todas las opciones son requeridas
                      </div>
                    ) : null}
                  </Row>
                ))}
              </FormGroup>
            </div>
            <Button
              outline
              onClick={this.handleAddOpcion}
              size="sm"
              color="primary"
              className="button margin-auto"
            >
              {' '}
              Agregar Opción{' '}
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default PreguntasAleatorias;
