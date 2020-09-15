import React, { Fragment } from 'react';
import { Input, Label, FormGroup } from 'reactstrap';

class RespuestaLibre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consigna: '',
      respuesta: '',
    };
  }

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        consigna: this.props.value.consigna,
      });
    }
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: value });
    this.props.onEjercicioChange({ [name]: value }, this.props.ejercicioId);
  };

  handleRespuestaChange = (event) => {
    const { value, name } = event.target;
    if (!name || name.length === 0) return;
    this.setState({ [name]: value });
    this.props.onEjercicioChange({ [name]: value }, this.props.value.numero);
  };

  render() {
    const { consigna, respuesta } = this.state;
    const { preview, resolve } = this.props;
    return (
      <Fragment>
        {preview && (
          <div>
            <Label>{consigna}</Label>
          </div>
        )}
        {resolve && (
          <div>
            <FormGroup className="mb-3 error-l-75">
              <Label>{consigna}</Label>
              <Input
                name="respuesta"
                defaultValue={respuesta}
                onInputCapture={this.handleRespuestaChange}
              />
              {this.props.submitted && !respuesta ? (
                <div className="invalid-feedback d-block">
                  La respuesta es requerida
                </div>
              ) : null}
            </FormGroup>
          </div>
        )}
        {!preview && !resolve && (
          <div>
            <FormGroup className="mb-3 error-l-75">
              <Label>Consigna</Label>
              <Input
                name="consigna"
                defaultValue={consigna}
                onInputCapture={this.handleChange}
              />
              {this.props.submitted && !consigna ? (
                <div className="invalid-feedback d-block">
                  La consigna es requerida
                </div>
              ) : null}
            </FormGroup>
          </div>
        )}
      </Fragment>
    );
  }
}

export default RespuestaLibre;
