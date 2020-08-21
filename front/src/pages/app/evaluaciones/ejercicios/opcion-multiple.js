import React, { Fragment } from 'react';
import { Row, Input, Button, Label, FormGroup } from 'reactstrap';

class OpcionMultiple extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      consigna: '',
      opciones: [
        {
          opcion: '',
          verdadera: false,
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
    const { opciones, consigna } = this.state;

    const { preview } = this.props;

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
                  name="verdadera"
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

        {!preview && (
          <div>
            <div className="rta-libre-container">
              <FormGroup className="error-l-75">
                <Label>Pregunta</Label>
                <Input
                  name="consigna"
                  onInputCapture={this.handleChange}
                  defaultValue={consigna}
                />
                {this.props.submitted && !consigna ? (
                  <div className="invalid-feedback d-block">
                    Debe ingresar una pregunta
                  </div>
                ) : null}
              </FormGroup>
            </div>
            <div className="rta-libre-container">
              <FormGroup className="error-l-275">
                <Label>Opciones (Marque con un tilde las correctas)</Label>
                {this.props.submitted &&
                (!opciones || opciones.length === 0) ? (
                  <div className="invalid-feedback d-block">
                    Debe cargar opciones
                  </div>
                ) : null}
                {opciones.map((op, index) => (
                  <Row key={'row' + index} className="opcionMultipleRow">
                    <Input
                      name="verdadera"
                      className="margin-auto checkbox"
                      type="checkbox"
                      onChange={(e) => this.handleCheckBoxChange(e, index)}
                      checked={op.verdadera}
                    />
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
                        Debe ingresar al menos una respuesta como verdadera
                      </div>
                    ) : null}
                    {this.props.submitted && opciones.find((x) => !x.opcion) ? (
                      <div className="invalid-feedback d-block">
                        Debe completar todas las opciones
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
