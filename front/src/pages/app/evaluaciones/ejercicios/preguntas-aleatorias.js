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
      isLoading: true,
    };
  }

  componentDidMount() {
    if (this.props.value.preguntas) {
      let aleatorias = [];
      while (aleatorias.length !== this.props.value.cantidad) {
        const number = Math.floor(
          Math.random() * this.props.value.preguntas.length
        );
        if (aleatorias.findIndex((x) => x === number) === -1)
          aleatorias.push(number);
      }
      this.setState({
        cantidad: this.props.value.cantidad,
        preguntas: this.props.value.preguntas,
        aleatorias: aleatorias,
        isLoading: false,
      });
    }
    this.setState({ isLoading: false });
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

  handleRespuestaChange = (event, index) => {
    const { value } = event.target;
    let rtas = this.state.respuestas;
    const indiceRta = rtas.findIndex((x) => x.indiceOpcion === index);
    if (indiceRta === -1) rtas.push({ indiceOpcion: index, respuesta: value });
    else
      rtas[indiceRta] = Object.assign(rtas[indiceRta], {
        indiceOpcion: index,
        respuesta: value,
      });
    this.setState({
      respuestas: rtas,
    });
    this.props.onEjercicioChange(rtas, this.props.value.numero);
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
    let { cantidad, respuestas, preguntas, aleatorias, isLoading } = this.state;

    const { preview, resolve } = this.props;

    return isLoading ? (
      <div className="loading" />
    ) : (
      <Fragment>
        {preview && (
          <div>
            {aleatorias.map((indice) => (
              <div className="mb-2" key={'rowlabel' + indice}>
                <Label>{preguntas[indice].opcion}</Label>
              </div>
            ))}{' '}
          </div>
        )}

        {resolve && (
          <div>
            {aleatorias.map((indice) => (
              <FormGroup className="error-l-75" key={'form' + indice}>
                <Label>{preguntas[indice].opcion}</Label>
                <Input
                  name="respuesta"
                  autoComplete="off"
                  onInputCapture={(e) => this.handleRespuestaChange(e, indice)}
                />
              </FormGroup>
            ))}{' '}
            {this.props.submitted &&
            (respuestas.length !== cantidad ||
              respuestas.find((x) => !x.respuesta)) ? (
              <div className="invalid-feedback d-block">
                Las respuestas son requeridas
              </div>
            ) : null}
          </div>
        )}

        {!preview && !resolve && (
          <div>
            <div>
              <FormGroup className="error-l-325">
                <Label>
                  Cantidad de preguntas a seleccionar aleatoriamente
                </Label>
                <Input
                  name="cantidad"
                  type="number"
                  onInputCapture={this.handleChange}
                  defaultValue={cantidad}
                />
                {this.props.submitted && !cantidad ? (
                  <div className="invalid-feedback d-block">
                    Ingresar la cantidad de preguntas
                  </div>
                ) : null}
              </FormGroup>
            </div>
            <div>
              <FormGroup className="error-l-75">
                <Label>Preguntas</Label>
                {this.props.submitted &&
                (!preguntas || preguntas.length === 0) ? (
                  <div className="invalid-feedback d-block">
                    Preguntas requeridas
                  </div>
                ) : null}
                {preguntas.map((pr, index) => (
                  <Row key={'row' + index} className="opcionMultipleRow">
                    <Input
                      className="opcionMultipleInput margin-auto"
                      name="opcion"
                      autoComplete="off"
                      onInputCapture={(e) => this.handleOptionsChange(e, index)}
                      defaultValue={pr.opcion}
                    />
                    <div
                      className="glyph-icon simple-icon-close remove-icon"
                      onClick={() => this.removeOption(index)}
                    />
                    {this.props.submitted &&
                    preguntas.find((x) => !x.opcion) ? (
                      <div className="invalid-feedback d-block">
                        Todas las preguntas son requeridas
                      </div>
                    ) : null}
                    {this.props.submitted && preguntas.length < cantidad ? (
                      <div className="invalid-feedback d-block">
                        Debe ingresar al menos {cantidad} preguntas
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
