import React, { Fragment } from 'react';
import { Row, Input, Button, Label, FormGroup } from 'reactstrap';

class OpcionMultiple extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      consigna: '',
      respuestas: [],
      type: '',
      opciones: [
        {
          opcion: '',
          verdadera: false,
        },
      ],
    };
  }

  componentDidMount() {
    if (this.props.respuestaUnica) {
      this.setState({
        type: 'radio',
      });
    } else {
      this.setState({
        type: 'checkbox',
      });
    }
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
    let list = this.state.opciones;
    list[index] = Object.assign(list[index], { [name]: value });
    this.setState({ opciones: list });
    this.props.onEjercicioChange({ opciones: list }, this.props.ejercicioId);
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
      this.props.value.numero,
      this.props.respuestaUnica
    );
  };

  handleAddOpcion = (e) => {
    let newOpciones = this.state.opciones;
    let opcion = {
      opcion: '',
      verdadera: false,
    };
    newOpciones.push(opcion);
    this.setState({
      opciones: newOpciones,
    });
  };

  removeOption = (index) => {
    let newOpciones = this.state.opciones;
    newOpciones.splice(index, 1);
    this.setState({
      opciones: newOpciones,
    });
  };

  render() {
    let { opciones, consigna, respuestas, type } = this.state;

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
                  type={type}
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
                  type={type}
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
          <div className="mb-3">
            <div>
              <FormGroup className="error-l-75">
                <Label>Pregunta</Label>
                <Input
                  autoComplete="off"
                  name="consigna"
                  onInputCapture={this.handleChange}
                  defaultValue={consigna}
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
                <Label>Opciones (Marque con un tilde las correctas)</Label>
                {this.props.submitted &&
                (!opciones || opciones.length === 0) ? (
                  <div className="invalid-feedback d-block">
                    Opciones requeridas
                  </div>
                ) : null}
                {opciones.map((op, index) => (
                  <Row key={'row' + index} className="opcionMultipleRow">
                    <Input
                      name="verdadera"
                      className="margin-auto checkbox"
                      type={type}
                      onChange={(e) => this.handleCheckBoxChange(e, index)}
                      checked={op.verdadera}
                    />
                    <Input
                      className="opcionMultipleInput margin-auto"
                      name="opcion"
                      onChange={(e) => this.handleOptionsChange(e, index)}
                      value={op.opcion}
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

export default OpcionMultiple;
