import React, { Fragment } from 'react';
import { Input, Label, FormGroup } from 'reactstrap';

class RespuestaLibre extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      consigna: '',
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

  render() {
    const { consigna } = this.state;
    const { preview } = this.props;
    return (
      <Fragment>
        {preview && (
          <div>
            <Label>{consigna}</Label>
          </div>
        )}
        {!preview && (
          <div className="rta-libre-container">
            <FormGroup className="mb-3 error-l-75">
              <Label>Consigna</Label>
              <Input
                name="consigna"
                defaultValue={consigna}
                onInputCapture={this.handleChange}
              />
              {this.props.submitted && !consigna ? (
                <div className="invalid-feedback d-block">
                  Debe ingresar una consigna
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
